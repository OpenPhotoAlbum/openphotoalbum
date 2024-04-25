import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { sortImagesBySubjectRecognition } from "../util/sort";
import './Recognized.styles.scss';
import Checkmark from '../assets/checkmark.svg';

const Recognized = () => {
    const [verified, setVerified] = useState<boolean>(false);
    
    const query = {
        limit: 1000,
        withRecognized: true,
    }
    const { data, isPending, error, refetch } = useFetch<any>('http://10.0.0.15:9447/scans/', query);
    
    return (
        <div id="Recognized">
            <header>
                <button onClick={() => setVerified(!verified)} className={verified ? 'ActiveBtn' : 'InactiveBtn'}>Verified</button>
            </header>
            <ul>
                { (!isPending && data?.data) && 
                    // @ts-ignore
                    Object.entries(
                        sortImagesBySubjectRecognition(
                            data.data, {
                                sortBy: 'similarity',
                                dir: 'desc'
                            }
                        )).map(([subjectId, images], i) => (
                        <li key={i}>
                            <h3>{subjectId}</h3>
                            <div className="SubjectImageListWrapper">
                                {/* @ts-ignore */}
                                { images.filter(a => verified ? a.similarity === 1 : a.similarity < 1).map((data, i) => (
                                    <React.Fragment key={i}>
                                        <div
                                            className="SubjectImage"
                                            style={{
                                                backgroundImage: `url("http://10.0.0.15:9447/img${data.image}")`,
                                            }}
                                        >
                                            { data.similarity === 1 && <img src={Checkmark} className="Checkmark" width="20px" alt=""/> }
                                            <p className="Similarity">{(parseFloat((Math.floor(data.similarity * 100) / 100).toFixed(2)) * 100) + '%'}</p>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Recognized;

/*

{
    "exif": {
        "SourceFile": "/home/uploads/cayce/iPhone/Recents/2008-10-07_15-11-08_IMG_1593.JPG",
        "errors": [],
        "Orientation": 1,
        "ExifToolVersion": 12.82,
        "FileName": "2008-10-07_15-11-08_IMG_1593.JPG",
        "Directory": "/home/uploads/cayce/iPhone/Recents",
        "FileSize": "450 kB",
        "FileModifyDate": {
            "_ctor": "ExifDateTime",
            "year": 2008,
            "month": 10,
            "day": 7,
            "hour": 15,
            "minute": 11,
            "second": 8,
            "tzoffsetMinutes": -240,
            "rawValue": "2008:10:07 15:11:08-04:00",
            "zoneName": "UTC-4",
            "inferredZone": false
        },
        "FileAccessDate": {
            "_ctor": "ExifDateTime",
            "year": 2024,
            "month": 4,
            "day": 24,
            "hour": 1,
            "minute": 40,
            "second": 0,
            "tzoffsetMinutes": -240,
            "rawValue": "2024:04:24 01:40:00-04:00",
            "zoneName": "UTC-4",
            "inferredZone": false
        },
        "FileInodeChangeDate": {
            "_ctor": "ExifDateTime",
            "year": 2024,
            "month": 4,
            "day": 22,
            "hour": 19,
            "minute": 3,
            "second": 19,
            "tzoffsetMinutes": -240,
            "rawValue": "2024:04:22 19:03:19-04:00",
            "zoneName": "UTC-4",
            "inferredZone": false
        },
        "FilePermissions": "-rwxrwxrwx",
        "FileType": "JPEG",
        "FileTypeExtension": "jpg",
        "MIMEType": "image/jpeg",
        "JFIFVersion": 1.01,
        "ExifByteOrder": "Big-endian (Motorola, MM)",
        "Make": "Canon",
        "Model": "Canon PowerShot A610",
        "XResolution": 72,
        "YResolution": 72,
        "ResolutionUnit": "inches",
        "Software": "Photos 2.0",
        "ModifyDate": {
            "_ctor": "ExifDateTime",
            "year": 2008,
            "month": 10,
            "day": 7,
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "2008:10:07 15:11:08",
            "inferredZone": false
        },
        "TileWidth": 512,
        "TileLength": 512,
        "ExposureTime": "1/125",
        "FNumber": 4,
        "ISO": 50,
        "ExifVersion": "0220",
        "DateTimeOriginal": {
            "_ctor": "ExifDateTime",
            "year": 2008,
            "month": 10,
            "day": 7,
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "2008:10:07 15:11:08",
            "inferredZone": false
        },
        "CreateDate": {
            "_ctor": "ExifDateTime",
            "year": 2008,
            "month": 10,
            "day": 7,
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "2008:10:07 15:11:08",
            "inferredZone": false
        },
        "ComponentsConfiguration": "Y, Cb, Cr, -",
        "CompressedBitsPerPixel": 5,
        "ShutterSpeedValue": "1/125",
        "ApertureValue": 4,
        "ExposureCompensation": 0,
        "MaxApertureValue": 2.8,
        "MeteringMode": "Multi-segment",
        "Flash": "Auto, Did not fire",
        "FocalLength": "7.3 mm",
        "FlashpixVersion": "0100",
        "ColorSpace": "sRGB",
        "ExifImageWidth": 768,
        "ExifImageHeight": 1024,
        "FocalPlaneXResolution": 7236.749104,
        "FocalPlaneYResolution": 7245.282609,
        "FocalPlaneResolutionUnit": "inches",
        "SensingMethod": "One-chip color area",
        "FileSource": "Digital Camera",
        "CustomRendered": "Normal",
        "ExposureMode": "Auto",
        "WhiteBalance": "Auto",
        "DigitalZoomRatio": 1,
        "SceneCaptureType": "Standard",
        "ImageUniqueID": "18e4cf845bbef2980000000000000000",
        "Compression": "JPEG (old-style)",
        "ThumbnailOffset": 886,
        "ThumbnailLength": 6601,
        "XMPToolkit": "XMP Core 6.0.0",
        "Lens": " 7.3-29.2mm",
        "FlashCompensation": 0,
        "Firmware": "Firmware Version 1.00",
        "CreatorTool": "Photos 2.0",
        "Title": "IMG_1657.JPG",
        "CurrentIPTCDigest": "9cdbe7c0fa943f42e1f0bf4aee973a74",
        "CodedCharacterSet": "UTF8",
        "ApplicationRecordVersion": 2,
        "DigitalCreationTime": {
            "_ctor": "ExifTime",
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "15:11:08",
            "inferredZone": false
        },
        "DigitalCreationDate": {
            "_ctor": "ExifDate",
            "year": 2008,
            "month": 10,
            "day": 7,
            "rawValue": "2008:10:07"
        },
        "ObjectName": "IMG_1657.JPG",
        "DateCreated": {
            "_ctor": "ExifDate",
            "year": 2008,
            "month": 10,
            "day": 7,
            "rawValue": "2008:10:07"
        },
        "TimeCreated": {
            "_ctor": "ExifTime",
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "15:11:08",
            "inferredZone": false
        },
        "IPTCDigest": "9cdbe7c0fa943f42e1f0bf4aee973a74",
        "ImageWidth": 768,
        "ImageHeight": 1024,
        "EncodingProcess": "Baseline DCT, Huffman coding",
        "BitsPerSample": 8,
        "ColorComponents": 3,
        "YCbCrSubSampling": "YCbCr4:2:0 (2 2)",
        "Aperture": 4,
        "ImageSize": "768x1024",
        "Megapixels": 0.786,
        "ScaleFactor35efl": 9.6,
        "ShutterSpeed": "1/125",
        "ThumbnailImage": {
            "_ctor": "BinaryField",
            "bytes": 6601,
            "rawValue": "(Binary data 6601 bytes, use -b option to extract)"
        },
        "DateTimeCreated": {
            "_ctor": "ExifDateTime",
            "year": 2008,
            "month": 10,
            "day": 7,
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "2008:10:07 15:11:08",
            "inferredZone": false
        },
        "DigitalCreationDateTime": {
            "_ctor": "ExifDateTime",
            "year": 2008,
            "month": 10,
            "day": 7,
            "hour": 15,
            "minute": 11,
            "second": 8,
            "rawValue": "2008:10:07 15:11:08",
            "inferredZone": false
        },
        "CircleOfConfusion": "0.003 mm",
        "FOV": "28.7 deg",
        "FocalLength35efl": "7.3 mm (35 mm equivalent: 70.4 mm)",
        "HyperfocalDistance": "4.27 m",
        "LightValue": 12,
        "LensID": " 7.3-29.2mm",
        "warnings": []
    },
    "image": {
        "dominantColor": "#797865"
    },
    "astronomy": {},
    "faces": {
        "detected": [],
        "recognized": [
            {
                "image": "/home/uploads/cayce/iPhone/Recents/scans/subjects/andrew_tachovsky/2008-10-07_15-11-08_IMG_1593___crop0.jpg",
                "crop": [
                    502,
                    380,
                    558,
                    427
                ],
                "subject": {
                    "subject": "andrew_tachovsky",
                    "similarity": 0.99999
                },
                "subject_id": "andrew_tachovsky",
                "age": {
                    "probability": 0.8991528749465942,
                    "high": 32,
                    "low": 25
                },
                "gender": {
                    "probability": 0.9896515011787415,
                    "value": "male"
                },
                "pose": {
                    "pitch": -14.921402461020392,
                    "roll": 5.474331738229807,
                    "yaw": 9.00595771266746
                },
                "box": {
                    "probability": 0.99984,
                    "x_max": 502,
                    "y_max": 558,
                    "x_min": 380,
                    "y_min": 427
                },
                "mask": {
                    "probability": 0.9999998807907104,
                    "value": "without_mask"
                },
                "landmarks": [
                    [
                        422,
                        483
                    ],
                    [
                        460,
                        480
                    ],
                    [
                        443,
                        507
                    ],
                    [
                        427,
                        521
                    ],
                    [
                        464,
                        516
                    ]
                ]
            },
            {
                "image": "/home/uploads/cayce/iPhone/Recents/scans/subjects/holly_tachovsky/2008-10-07_15-11-08_IMG_1593___crop1.jpg",
                "crop": [
                    470,
                    364,
                    395,
                    280
                ],
                "subject": {
                    "subject": "holly_tachovsky",
                    "similarity": 0.99995
                },
                "subject_id": "holly_tachovsky",
                "age": {
                    "probability": 0.9999967813491821,
                    "high": 32,
                    "low": 25
                },
                "gender": {
                    "probability": 0.9999995231628418,
                    "value": "female"
                },
                "pose": {
                    "pitch": -7.636289170346316,
                    "roll": -1.500402753625167,
                    "yaw": 16.14616767226302
                },
                "box": {
                    "probability": 0.99974,
                    "x_max": 470,
                    "y_max": 395,
                    "x_min": 364,
                    "y_min": 280
                },
                "mask": {
                    "probability": 1,
                    "value": "without_mask"
                },
                "landmarks": [
                    [
                        398,
                        329
                    ],
                    [
                        433,
                        331
                    ],
                    [
                        412,
                        353
                    ],
                    [
                        398,
                        361
                    ],
                    [
                        433,
                        364
                    ]
                ]
            },
            {
                "image": "/home/uploads/cayce/iPhone/Recents/scans/subjects/eli_tachovsky/2008-10-07_15-11-08_IMG_1593___crop2.jpg",
                "crop": [
                    587,
                    491,
                    587,
                    491
                ],
                "subject": {
                    "subject": "eli_tachovsky",
                    "similarity": 0.99998
                },
                "subject_id": "eli_tachovsky",
                "age": {
                    "probability": 1,
                    "high": 6,
                    "low": 4
                },
                "gender": {
                    "probability": 0.9999911785125732,
                    "value": "female"
                },
                "pose": {
                    "pitch": -15.090251901975307,
                    "roll": 0.9153267938156944,
                    "yaw": 16.99827129074176
                },
                "box": {
                    "probability": 0.99957,
                    "x_max": 587,
                    "y_max": 587,
                    "x_min": 491,
                    "y_min": 491
                },
                "mask": {
                    "probability": 0.9999990463256836,
                    "value": "without_mask"
                },
                "landmarks": [
                    [
                        518,
                        534
                    ],
                    [
                        547,
                        532
                    ],
                    [
                        528,
                        552
                    ],
                    [
                        521,
                        563
                    ],
                    [
                        548,
                        561
                    ]
                ]
            },
            {
                "image": "/home/uploads/cayce/iPhone/Recents/scans/subjects/margaret/2008-10-07_15-11-08_IMG_1593___crop3.jpg",
                "crop": [
                    337,
                    260,
                    548,
                    467
                ],
                "subject": {
                    "subject": "margaret",
                    "similarity": 0.98979
                },
                "subject_id": "margaret",
                "age": {
                    "probability": 0.992059588432312,
                    "high": 2,
                    "low": 0
                },
                "gender": {
                    "probability": 1,
                    "value": "male"
                },
                "pose": {
                    "pitch": -0.07512997922128761,
                    "roll": 3.725254541360357,
                    "yaw": 21.855766876135444
                },
                "box": {
                    "probability": 0.99851,
                    "x_max": 337,
                    "y_max": 548,
                    "x_min": 260,
                    "y_min": 467
                },
                "mask": {
                    "probability": 1,
                    "value": "without_mask"
                },
                "landmarks": [
                    [
                        288,
                        504
                    ],
                    [
                        315,
                        502
                    ],
                    [
                        300,
                        515
                    ],
                    [
                        291,
                        526
                    ],
                    [
                        315,
                        524
                    ]
                ]
            }
        ]
    },
    "jsonFile": "/home/uploads/cayce/iPhone/Recents/scans/2008-10-07_15-11-08_IMG_1593.JPG.json"
}

*/