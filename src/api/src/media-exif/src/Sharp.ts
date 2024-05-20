import sharp, { OutputInfo } from "sharp";
import color from "color";
import mime from 'mime';

type SharpType = {
    path: string;
}

export type Resize = {
    height?: number;
    width?: number;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
};

export type Crop = { left: number; top: number; height: number; width: number };
export type CropBox = [number, number, number, number];

class Sharp {
    path: string;
    mimetype: string;

    supportedMIMEtypeInput = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg",
        "image/tiff"
    ]

    constructor(args: SharpType) {
        const { path } = args;
        this.mimetype = mime.getType(path);
        if (!this.supportedMIMEtypeInput.includes(this.mimetype)) {
            throw new Error(`File type not supported: ${this.mimetype}`)
        }
        this.path = path;
    }

    private sharp(path?: string): sharp.Sharp {
        return sharp(path || this.path).withMetadata().rotate()
    }

    private assertImage() {
        if (!this.mimetype.includes("image")) {
            throw new Error("toFile can only be used with image types");
        }
    }

    async resize({ height, width, fit }: Resize): Promise<sharp.Sharp> {
        return this.sharp().resize({
            height,
            width,
            fit: sharp.fit[fit || "contain"],
        })
    }

    async toBuffer({ strip = false }: { strip?: boolean } | undefined): Promise<{ data: Buffer; info: OutputInfo; }> {
        const buf = this.sharp();

        if (strip) {
            return await buf.withExif({}).toBuffer({ resolveWithObject: true });
        }

        return await buf.toBuffer({ resolveWithObject: true });
    }

    async getDominantColor(): Promise<string> {
        const { channels: [rc, gc, bc] } = await this.sharp().stats();
        const r = rc ? Math.round(rc.mean) : 0;
        const g = gc ? Math.round(gc.mean) : 0;
        const b = bc ? Math.round(bc.mean) : 0;
        return color({ r, g, b }).hex();
    }

    public async crop(crop: Crop | CropBox): Promise<Buffer> {
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
        const { data } = await this.sharp()
            .extract(extract)
            .toBuffer({ resolveWithObject: true });

        return data;
    }
}

export default Sharp