import dotenv from "dotenv";
import Exif from "./dist/index.cjs";
import { inspect } from "util";
import chalk from "chalk";

dotenv.config();

const MEDIA = [
	"/home/photogate/@photogate/media-exif-sdk/sample/iphone-live.jpg", // 0
	"/home/photogate/@photogate/media-exif-sdk/sample/iphone-live.mov", // 1
	"/home/photogate/@photogate/media-exif-sdk/sample/iphone.JPG", // 2
	"/home/photogate/@photogate/media-exif-sdk/sample/android.JPG", // 3
	"/home/photogate/@photogate/media-exif-sdk/sample/android.MP4", // 4
	"/home/photogate/@photogate/media-exif-sdk/sample/google-pixel-7.webp", // 5
	"/home/photogate/@photogate/media-exif-sdk/sample/android-cat.jpg", // 6
	"/home/photogate/@photogate/media-exif-sdk/sample/android-no-meta (1).webp", // 7
];

const run = async () => {
	try {
		const Media = new Exif({ path: MEDIA[0], strip: false });

		const metadata = await Media.getMetadata();
		console.log(inspect(metadata, false, 5, true));
		console.log(
			chalk
				.hex(metadata.dominantColor)
				.bold("DOMINANT COLOR " + metadata.dominantColor)
		);
		// console.log({

		// 	totalWidth: metadata.width,
		// 	totalHeight: metadata.height,
		// });

		// await Media.crop({ top: 0, left: 0, height: 300, width: 300 });
		// await Media.resize({ width: 100 });
		// await Media.toFile({
		// 	path: "/home/photogate/@photogate/media-exif-sdk/sample/out/iphone-copy2.png",
		// 	format: "png",
		// });

		// const res = await Media.tint("#ff00004f");
		// await Media.grayscale();
		// const buffer = await Media.toBuffer();

		// await Media.copy(
		// 	"/home/photogate/@photogate/media-exif-sdk/sample/out/iphone-copy3.png"
		// );

		// console.log(metadata);
		// const res = await Media.getMetadata();
		// const res = await Media.getDominantColor();
		// const res = await Media.toBuffer();

		// console.log(inspect(res, false, null, true));
	} catch (e) {
		console.error(e);
	}
};

run();
