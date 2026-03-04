import { forwardRef } from 'react';

const ReceiptTemplate = forwardRef(({ receiptData, formatCurrency }, ref) => {
    if (!receiptData) return null;
    const { payment, customerName, loanType } = receiptData;

    return (
        <div
            ref={ref}
            className="bg-white p-10 w-[800px] text-gray-800"
            style={{
                fontFamily: "'Inter', sans-serif",
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                zIndex: -1
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-blue-600 tracking-tight">CrediFlow</h1>
                    <p className="text-gray-500 mt-1">Official Payment Receipt</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 font-mono">REC-{String(payment._id).slice(-6).toUpperCase()}</p>
                    <p className="font-semibold">{new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Customer / Entity</p>
                    <h2 className="text-xl font-bold text-gray-900">{customerName}</h2>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded ${loanType === 'GIVEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                        {loanType === 'GIVEN' ? 'LOAN GIVEN' : 'LOAN TAKEN'}
                    </span>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <h2 className="text-xl font-bold text-gray-900">{payment.paymentMethod}</h2>
                </div>
            </div>

            {/* Amount Block */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-10 text-center">
                <p className="text-blue-600 font-medium mb-2">Amount Received</p>
                <div className="text-5xl font-black text-blue-900">
                    {formatCurrency(payment.amount)}
                </div>
                {payment.notes && (
                    <p className="mt-4 text-gray-600 bg-white inline-block px-4 py-2 rounded border border-blue-100">
                        "{payment.notes}"
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                <p>This is a computer-generated receipt originating from CrediFlow.</p>
                <p>Thank you for your business.</p>
            </div>
        </div>
    );
});

export default ReceiptTemplate;
