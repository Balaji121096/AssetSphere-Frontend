import fs from 'fs';

const fixEmojis = (file) => {
    let text = fs.readFileSync(file, 'utf8');
    text = text.replace(/\+/g, '?');
    text = text.replace(/\+\?/g, '?');
    text = text.replace(/dY\?\\"/g, '??');
    text = text.replace(/dY`  /g, '??');
    text = text.replace(/\?/g, '-');
    text = text.replace(/o/g, '×');
    text = text.replace(/\+/g, '+');
    fs.writeFileSync(file, text, 'utf8');
}

fixEmojis('G:/Projects/AssetSphere-Frontend/src/pages/Projects.jsx');
fixEmojis('G:/Projects/AssetSphere-Frontend/src/pages/ProjectDetails.jsx');
console.log('Fixed');
