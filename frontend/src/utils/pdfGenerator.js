import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export const generatePDF = async (elementRef, filename = 'receipt.pdf') => {
    if (!elementRef.current) {
        toast.error('Failed to generate PDF. Template could not be found.');
        return;
    }

    try {
        const loadingToastId = toast.loading('Generating PDF receipt...');

        // Wait a tick to ensure any fonts or styles have painted if they were just mounted
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(elementRef.current, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 Paper format
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);

        toast.dismiss(loadingToastId);
        toast.success(`Receipt downloaded: ${filename}`);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        toast.error('Failed to generate PDF receipt. Please try again.');
    }
};
