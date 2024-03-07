/**
 * 
 * @param {*} cptCodes 
 * @returns HTML for cpt codes display
 */
const cptCodeHtml = async (cptCodes) => {
    const cptCodesHtml = await cptCodes.map((code) => {
        return `<tr align="center">
        <td style="font-size: 13px" class="f-fallback sub">${code.cptCode ? code.cptCode : '-'}</td>
        <td style="font-size: 13px" class="f-fallback sub">${code.dose ? code.dose : '-'}</td></tr>`
    }).join('');

    return cptCodesHtml;
}

module.exports = { cptCodeHtml }