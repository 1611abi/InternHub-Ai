const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const path = require('path');

const generateResumePDF = async (data, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc.fontSize(20).text(data.name || 'Resume', { align: 'center' });
        doc.fontSize(12).text(data.email || '', { align: 'center' });
        doc.moveDown();

        // Summary
        if (data.summary) {
            doc.fontSize(14).text('Profile Summary', { underline: true });
            doc.fontSize(10).text(data.summary);
            doc.moveDown();
        }

        // Skills
        if (data.skills) {
            doc.fontSize(14).text('Skills', { underline: true });
            doc.fontSize(10).text(data.skills);
            doc.moveDown();
        }

        // Experience
        if (data.experience) {
            doc.fontSize(14).text('Experience', { underline: true });
            doc.fontSize(10).text(data.experience);
            doc.moveDown();
        }

        // Education
        if (data.education) {
            doc.fontSize(14).text('Education', { underline: true });
            doc.fontSize(10).text(data.education);
            doc.moveDown();
        }

        // Projects
        if (data.projects) {
            doc.fontSize(14).text('Projects', { underline: true });
            doc.fontSize(10).text(data.projects);
            doc.moveDown();
        }

        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
    });
};

module.exports = {
    generateResumePDF
};
