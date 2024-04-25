import fs from 'fs';
import path from 'path';

export const copyToClipboardScript = fs.readFileSync(path.resolve('/home/openphoto/@photogate/api/public/copy.js'), 'utf8')
export const generateSelectBoxScript = fs.readFileSync(path.resolve('/home/openphoto/@photogate/api/public/selectbox.js'), 'utf8')
