import html2pdf from 'html2pdf.js';

export async function exportToPdf(element, fileName = 'resume.pdf') {
    if (!element) return;

    const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    try {
        // Temporarily remove transform to ensure 1:1 crisp A4 capture
        const originalTransform = element.style.transform;
        element.style.transform = 'none';

        await html2pdf().set(opt).from(element).save();

        // Restore transform for preview
        element.style.transform = originalTransform;
    } catch (err) {
        console.error('PDF export failed:', err);
        throw err;
    }
}
