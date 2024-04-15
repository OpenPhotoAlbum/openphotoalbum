import exiftool from "node-exiftool";
import color from "color";
import { RawExifData } from "./types/Exif";
import fs, { PathLike } from "fs";
import Color from "color";
import Path from "path";
import { formatMetadata } from "./util/format";
import mime from "mime";
import sharp, { AvailableFormatInfo, FormatEnum, OutputInfo } from "sharp";
import exifremove from "exifremove";
import {
	Config,
	Output,
	Resize,
	Crop,
	CropBox,
	CopyOptions,
	ExifToolProcess,
} from "./types/MediaExif";

import { ExifData, MimeTypes } from "@photogate/types";

export * from "./types/Exif";
export * from "./types/MediaExif";

new exiftool.ExiftoolProcess("/usr/bin/exiftool");

const THUMBNAIL_FLAG = "b";
const PRINT_CONVERSION = "n";

/**
 * @name MediaExif
 * Tool for managing media files
 * @method Media.getMetadata
 * @method Media.toFile
 * @method Media.toBuffer
 * @method Media.copy
 * @method Media.crop
 * @method Media.resize
 * @method Media.blur
 * @method Media.tint
 * @method Media.grayscale
 *
 * @example
 *
 * **New Media**
 * ```
 * const Media = new Exif({ path: "./image.jpeg", strip: true });
 * ```
 *
 * **Metadata**
 * ```
 * const Media = new Exif({ path: "./image.jpeg", strip: true });
 * const metadata = await Media.getMetadata();
 * console.log(metadata);
 * ```


 */
class MediaExif {
	// Config
	public path: string;
	public mime: string;
	public strip: boolean;
	public buffer: Buffer;
	public data: ExifData;
	public getMetaDataFlags = [PRINT_CONVERSION, THUMBNAIL_FLAG];
	public raw: RawExifData;
	public height: number;
	public width: number;
	private tool: ExifToolProcess;
	public processable: boolean;
	public dominantColor: string;

	constructor(config: Config) {
		this.path = config.path;
		this.strip = config.strip || false;
		this.mime = mime.getType(config.path);
		this.tool = new exiftool.ExiftoolProcess("/usr/bin/exiftool");
	}

	private sharp(): sharp.Sharp {
		return sharp(this.buffer || this.path)
			.withMetadata()
			.rotate();
	}

	private stripMetadata(): Buffer {
		this.buffer = exifremove.remove(this.buffer);
		return this.buffer;
	}

	private assertImage() {
		if (!this.mime.includes("image")) {
			throw new Error("toFile can only be used with image types");
		}
	}

	private output(
		buffer?: { data?: Buffer; info: sharp.OutputInfo },
		path?: string
	): Output {
		this.height = buffer?.info?.height || this.data?.details?.imageHeight;
		this.width = buffer?.info?.width || this.data?.details?.imageWidth;
		this.buffer = buffer?.data;

		return {
			fileName: Path.parse(path || this.path).base,
			directory: Path.parse(path || this.path).dir,
			path: path || this.path,
			mime: mime.getType(path || this.path) as MimeTypes,
			format: buffer?.info.format,
			size: buffer?.info.size || this.data?.fileSize,
			width: this.width,
			height: this.height,
			channels: buffer?.info.channels,
			premultiplied: buffer?.info.premultiplied,
			metadata: this.data,
			dominantColor: this.dominantColor,
			buffer: undefined, // this.buffer,
		};
	}

	public async isProcessable(): Promise<boolean> {
		try {
			const stats = await this.sharp().stats();
			this.processable = Boolean(stats && stats.channels);
		} catch (e) {
			this.processable = false;
		}
		return this.processable;
	}

	public async getMetadata(): Promise<Output> {
		try {
			await this.tool.open();
			await this.tool
				.readMetadata<RawExifData>(this.path, this.getMetaDataFlags)
				.then(
					(res) => (this.raw = res?.data ? res?.data[0] : undefined),
					console.error
				)
				.catch((e) => console.error(e));
			await this.tool.close();
			this.data = formatMetadata(this.raw);
			this.height = this.data?.height;
			this.width = this.data?.width;
			let bufferData: {
				data: Buffer | undefined;
				info: OutputInfo | undefined;
			};

			if (this.mime.includes("image")) {
				await this.sharp()
					.stats()
					.then(({ channels: [rc, gc, bc] }) => {
						const r = Math.round(rc.mean),
							g = Math.round(gc.mean),
							b = Math.round(bc.mean);
						this.dominantColor = color({ r, g, b }).hex();
					})
					.catch(console.error);
			}

			return this.output(bufferData);
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * @method
	 * @name toFile
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(
	 *   await Media.toFile({ path: "./image-save.jpeg", format: "png"})
	 * );
	 * ```
	 */
	public async toFile(options?: {
		path?: string;
		format?: keyof FormatEnum | AvailableFormatInfo;
	}): Promise<Output> {
		this.assertImage();
		await this.getMetadata();

		let _path = options?.path;
		let _outputDirectory = this.data?.directory;
		const _fileName = this.data?.fileName;

		if (!_path) {
			_outputDirectory = `${this.data?.directory}/out`;

			await fs.promises.mkdir(_outputDirectory, { recursive: true });
			_path = `${_outputDirectory}/${_fileName}`;
		}

		const _sharp = this.sharp();

		if (options?.format) {
			_sharp.toFormat(options.format);
			_path = _path.replace(Path.parse(_path).ext, `.${options.format}`);
		}

		if (this.strip) this.stripMetadata();

		await _sharp.toFile(_path);
		const bufferData = await _sharp.toBuffer({ resolveWithObject: true });
		return this.output(bufferData, _path);
	}

	/**
	 * @method
	 * @name toBuffer
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(await Media.toBuffer());
	 * ```
	 */
	public async toBuffer(): Promise<Output> {
		if (!this.buffer) this.buffer = await fs.promises.readFile(this.path);
		if (this.strip) {
			this.stripMetadata();
		} else {
			const data = await this.getMetadata();
			this.data = data.metadata;
		}
		const bufferData = await this.sharp().toBuffer({ resolveWithObject: true });
		return this.output(bufferData);
	}

	/**
	 * @method
	 * @name Crop
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(
	 *   await Media.copy(
	 *     "./image-copy.jpeg"
	     )
	   );
	 * ```
	 */
	public async copy(
		dest: PathLike,
		options?: CopyOptions
	): Promise<Partial<Output>> {
		if (!this.buffer) this.buffer = await fs.promises.readFile(this.path);
		if (this.strip) this.stripMetadata();
		await fs.promises.writeFile(dest, this.buffer, options);

		// TODO: Figure out how to use this.output(???, dest);
		const buffer = await sharp(this.buffer).toBuffer({
			resolveWithObject: true,
		});
		return this.output(buffer);
	}

	/**
	 * @method
	 * @name Crop
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(await Media.crop({ top: 0, left: 0, height: 300, width: 300 }));
	 * ```
	 */
	public async crop(crop: Crop | CropBox): Promise<Output> {
		this.assertImage();
		let extract: Crop;
		if (Array.isArray(crop)) {
			const [xmax, xmin, ymax, ymin] = crop;
			extract = {
				left: xmin,
				top: ymin,
				width: xmax - xmin,
				height: ymax - ymin,
			};
		} else {
			extract = crop;
		}

		const _sharp = this.sharp().extract(extract);

		const buffer = await _sharp.toBuffer({ resolveWithObject: true });

		return this.output(buffer);
	}

	/**
	 * @method
	 * @name Resize
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(await Media.resize({ width: 100 }));
	 * ```
	 */
	public async resize({ height, width, fit }: Resize): Promise<Output> {
		this.assertImage();
		const buffer = await this.sharp()
			.resize({
				fit: sharp.fit[fit || "contain"],
				height,
				width,
			})
			.toBuffer({ resolveWithObject: true });
		return this.output(buffer);
	}

	/**
	 * Σ: a value between 0.3 and 1000 representing the sigma of the
	 * Gaussian mask, where sigma = 1 + radius / 2.
	 */
	public async blur(Σ: number): Promise<Output> {
		this.assertImage();
		const buffer = await this.sharp()
			.blur(Σ)
			.toBuffer({ resolveWithObject: true });
		return this.output(buffer);
	}

	/**
	 * @method
	 * @name **Tint**
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(await Media.tint("#f00"));
	 * ```
	 */
	public async tint(color: Color): Promise<Output> {
		this.assertImage();
		const rgb = Color(color).rgb().object();
		const buffer = await this.sharp()
			.tint(rgb)
			.toBuffer({ resolveWithObject: true });
		return this.output(buffer);
	}

	/**
	 * @method
	 * @name **Grayscale**
	 * @example
	 * ```
	 * const Media = new Exif({ path: "./image.jpeg", strip: true });
	 * console.log(await Media.grayscale())
	 * ```
	 */
	public async grayscale(): Promise<Output> {
		this.assertImage();
		const buffer = await this.sharp()
			.grayscale()
			.toBuffer({ resolveWithObject: true });
		return this.output(buffer);
	}
}

export default MediaExif;
