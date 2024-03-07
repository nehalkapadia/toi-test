module.exports = {
    STATUS_MAPPING: {
        'Pending UM review': [
            'Pending UM Admin Review',
            'Ready to Submit for UM Review',
            'Hold for Clinical Trials Screening',
            'Pending UM Review',
            'Hold per Ordering MD',
            'Hold per UM Reviewer',
            'External Trial Reviewed by Dr. LaPorte - Not a candidate',
            'Cleared by UM Review'
        ],
        'Order submitted': [
            'Ready for Submission',
            'Hold for Medication Order Change',
            'Pending Submission Clarification',
            'Order Submitted to Health Plan',
            'Order Submitted to IPA/Medical Group',
            'Pending Payer Approval'
        ],
        'Pending additional information': ['Pending Information Requested by Payer'],
        'Approved - Response received from payers (Check attachments)': [
            'Approved by Payer'
        ],
        'Denied - Response received from payers (Check attachments)': [
            'Denied by Payer',
            'Denied / Pending Reply from MD',
            'Denied / Pending Appeal'
        ],
    },
    APPROVED_STATUS: 'Approved - Response received from payers (Check attachments)',
    DENIED_STATUS: 'Denied - Response received from payers (Check attachments)',
    DEFAULT_STATUS: 'Pending Assignment',
    NOT_MAPPED_STATUS: 'Pending UM Review (Not Managed)',
}