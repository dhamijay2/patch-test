document.addEventListener('DOMContentLoaded', () => {
            const collateHandoutsBtn = document.getElementById('collate-handouts');

            // Allergen to PDF mapping (from review)
            const allergenPdfMap = {
                "1,3-Diphenylguanidine 1% pet.": ["DIPHENYLGUANIDINE.pdf"],
                "2-Bromo-2-nitropropane-1,3-diol 0.5% pet.": ["2-BROMO-2-NITROPROPANE-13-DIOLBRONOPOL.pdf", "Formaldehyde_Avoidance_Diet.pdf"],
                "2-Hydroxy-4-methoxybenzophenone (benzophenone-3) 10% pet.": ["BENZOPHENONE-3.pdf"],
                "2-Hydroxyethyl methacrylate 2% pet.": ["2-HYDROXYETHYL_METHACRYLATE.pdf"],
                "2-Mercaptobenzothiazole (MBT) 1% pet.*": ["BENZOTHIAZOLES.pdf"],
                "2-n-Octyl-4-isothiazolin-3-one 0.1% pet.": ["METHYLCHLOROISOTHIAZOLINONE.pdf", "METHYLISOTHIAZOLINONE.pdf"],
                "2-tert-Butyl-4-methoxyphenol (BHA) 2% pet.": ["BUTYLHYDROXYANISOLE.pdf"],
                "4-tert-Butylphenol formaldehyde resin (PTBP) 1% pet.*": ["PARATERTIARY BUTYLPHENOL FORMALDEHYDE RESIN.pdf"],
                "Amidoamine 0.1% aq": ["AMIDOAMINE.pdf"],
                "Bacitracin 20% pet. *": ["BACITRACIN.pdf"],
                "Balsam Peru (Myroxylon pereirae) 25% pet.*": ["BALSAM_OF_PERU.pdf", "Balsam_of_Peru_Diet.pdf"],
                "Benzocaine 5% pet.": ["BENZOCAINE.pdf"],
                "Benzoic acid (benzolyperoxide) 1% pet.": ["BENZOIC_ACID.pdf", "Benzoic_Acid_Diet.pdf"],
                "Benzyl alcohol 10% soft": ["BENZYL_ALCOHOL.pdf"],
                "Benzyl salicylate 10% pet.": ["BENZYL_SALICYLATE.pdf"],
                "Budesonide 0.1% pet.*": ["CORTICOSTEROIDS 1.pdf"],
                "Carba mix 3% pet.*": ["CARBA_MIX.pdf"],
                "Chloroxylenol (PCMX) 1% pet.": ["PCMX.pdf"],
                "Cinnamic aldehyde 1% pet": ["CINNAMIC_ALDEHYDE.pdf"],
                "Clobetasol-17-propionate 1% pet.": ["CORTICOSTEROIDS 1.pdf"],
                "Cobalt (II) chloride 1% pet.*": ["COBALT.pdf", "Cobalt_Diet.pdf"],
                "Cocamide DEA (Coconut diethanolamide) 0.5% pet.": ["COCAMIDE_DEA.pdf"],
                "Cocamidopropyl betaine 1% aq.": ["COCAMIDOPROPYL_BETAINE.pdf"],
                "Colophony 20% pet.*": ["COLOPHONY.pdf"],
                "Compositae mix II 5% pet.": ["COMPOSITAE.pdf"],
                "Decyl glucoside 5% pet.": ["DECYL_GLUCOSIDE.pdf"],
                "Desoximetasone 1% pet.": ["CORTICOSTEROIDS 1.pdf"],
                "Diazolidinyl urea 1% pet.*": ["Formaldehyde_Avoidance_Diet.pdf", "DIAZOLIDINYL_UREA.pdf"],
                "Dibucaine hydrochloride 2.5% pet": ["ANESTHETICS.pdf"],
                "Disperse blue 106/124 mix 1.0% pet.*": ["DISPERSE_BLUE_MIX.pdf"],
                "Disperse orange 3 1% pet.": ["DISPERSE_ORANGE_DYE.pdf"],
                "Disperse yellow 3 1% pet.": ["DISPERSE_YELLOW_DYE.pdf"],
                "DMDM hydantoin 1% pet.": ["Formaldehyde_Avoidance_Diet.pdf", "DMDM_HYDANTOIN.pdf"],
                "Epoxy resin 1% pet.*": ["EPOXY.pdf"],
                "Ethyl acrylate 0.1% pet.": ["ETHYL_ACRYLATE.pdf"],
                "Ethylhexyl salicylate 5% pet.": ["HOMOSALATE.pdf", "HOMOSALATE_.pdf"],
                "Ethylenediamine dihydrochloride 1% pet.*": ["ETHYLENEDIAMINE.pdf"],
                "Ethyleneurea melamine-formaldehyde mix 5% pet.": ["FORMALDEHYDE.pdf", "Formaldehyde_Avoidance_Diet.pdf"],
                "Formaldehyde 2% aq.*": ["FORMALDEHYDE.pdf"],
                "Fragrance mix I 8% pet.*": ["FRAGRANCE_MIX_1.pdf"],
                "Fragrance mix II 14% pet": ["FRAGRANCE_MIX_II.pdf"],
                "Fusidic acid sodium salt 2% pet.": [],
                "Glutaral 0.5% pet.": ["GLUTARALDEHYDE.pdf"],
                "Glyceryl thioglycolate 1% pet.": ["GLYCERYL THIOGLYCOLATE.pdf"],
                "Gold sodium thiosulfate dihydrate 0.5% pet.*": ["GOLD.pdf"],
                "Hydroxyisohexyl 3-cyclohexene carboxaldeyde 5% pet.": ["FRAGRANCE.pdf"],
                "Hydroperoxides of Limonene 0.3% pet.": ["LIMONENE.pdf"],
                "Hydroperoxides of Linalool 1% pet.": ["LINALOOL.pdf"],
                "Imidazolidinyl urea 2% pet.*": ["IMIDAZOLIDINYL_UREA.pdf", "Formaldehyde_Avoidance_Diet.pdf"],
                "Iodopropynyl butylcarbamate 0.2% pet.": ["IODOPROPYNYL BUTYLCARBAMATE.pdf"],
                "Isopropyl myristate 20% pet.": ["isopropyl_myristate.pdf"],
                "Isoamyl p-methoxycinnamate 10% pet.": ["isoamyl_p-methoxycinnamate.pdf"],
                "Lanolin alcohol (Amerchol 101) 50% pet.*": ["LANOLIN.pdf"],
                "Lidocaine 15% pet.": ["LIDOCAINE.pdf"],
                "Mercapto mix 1% pet.*": ["BENZOTHIAZOLES_MERCAPTO_MIX.pdf"],
                "Methyldibromo glutaronitrile 0.5% pet.": ["PHENOXYETHANOL.pdf"],
                "Methyl methacrylate 2% pet.": ["METHYL_METHACRYLATE.pdf"],
                "Methylchloroisothiazolinone/methylisothiazolinone 0.02% aq.*": ["METHYLISOTHIAZOLINONE.pdf"],
                "Methylisothiazolinone 0.2% aq.": ["METHYLISOTHIAZOLINONE.pdf"],
                "Mixed dialkyl thioureas 1% pet.": ["DIALKYL_THIOUREAS.pdf"],
                "Neomycin 20% pet.*": ["NEOMYCIN.pdf"],
                "Nickel sulfate 2.5% pet.*": ["NICKEL.pdf", "Low-Nickel_Diet.pdf"],
                "Oleamidopropyl dimethylamine 0.1% aq.": ["OLEAMIDOPROPYL DIMETHYLAMINE.pdf"],
                "Paraben mix 12% pet. *": ["PARABEN.pdf", "Paraben_Diet.pdf"],
                "Polysorbate 80 5% pet.": ["SORBITAN SESQUIOLEATE.pdf"],
                "Potassium dichromate 0.25% pet.*": ["CHROMATE.pdf", "Chromium_Diet.pdf"],
                "p-Phenylenediamine (PPD) 1% pet.*": ["PARAPHENYLENEDIAMINE.pdf"],
                "Propolis 10% pet.": ["PROPOLIS.pdf"],
                "Propylene glycol 30% aq.": ["PROPYLENE GLYCOL.pdf", "Propylene_Glycol_Diet.pdf"],
                "Quaternium-15 2% pet.": ["QUATERNIUM-15.pdf", "Formaldehyde_Avoidance_Diet.pdf"],
                "Sesquiterpene lactone mix 0.1% pet.": ["SESQUITERPENE LACTONES.pdf"],
                "Tea tree oil 5% pet.": ["TEA TREE OIL.pdf"],
                "Textile dye mix 6.6% pet.": ["TEXTILE_DYES.pdf"],
                "Thimerosal 0.1% pet.": ["Thimerosal.pdf"],
                "Thiuram mix 1% pet.*": ["THIURAM MIX.pdf"],
                "Tixocortol-21-pivalate 1% pet.*": ["CORTICOSTEROIDS 1.pdf"],
                "Tocopherol 100%": ["VITAMIN E.pdf"],
                "Toluenesulfonamide formaldehyde resin 10%": ["TOSYLAMIDE FORMALDEHYDE RESIN.pdf", "Formaldehyde_Avoidance_Diet.pdf"],
                "Triethanolamine 2% pet.": ["TRIETHANOLAMINE.pdf"],
                "Ylang-ylang 2% pet.": ["YLANG YLANG OIL.pdf"],
                "Titanium": []
            };

            collateHandoutsBtn.addEventListener('click', () => {
                // Find positive allergens
                const positives = Object.entries(selectionState)
                    .filter(([name, state]) => {
                        return [state.day2, state.day7].some(val => val === '1+' || val === '2+' || val === '3+');
                    })
                    .map(([name]) => name);

                // Collate PDFs
                const pdfs = Array.from(new Set(positives.flatMap(name => allergenPdfMap[name] || [])));

                if (pdfs.length === 0) {
                    alert('No positive allergens with mapped handouts.');
                    return;
                }

                // Fetch and merge PDFs using PDF-lib (correct async usage)
                (async () => {
                    try {
                        const buffers = await Promise.all(
                            pdfs.map(pdf => fetch(`patch test handouts/${pdf}`).then(r => {
                                if (!r.ok) throw new Error(`Failed to fetch ${pdf}`);
                                return r.arrayBuffer();
                            }))
                        );
                        const mergedPdf = await PDFLib.PDFDocument.create();
                        for (const buffer of buffers) {
                            const pdfDoc = await PDFLib.PDFDocument.load(buffer);
                            const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                            pages.forEach(page => mergedPdf.addPage(page));
                        }
                        const mergedBytes = await mergedPdf.save();
                        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'collated-handouts.pdf';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    } catch (err) {
                        alert('Failed to collate PDFs. Some handouts may be missing or inaccessible.');
                        console.error(err);
                    }
                })();
            });
        const exportPngBtn = document.getElementById('export-png-btn');
        const exportRtfBtn = document.getElementById('export-rtf-btn');
        // Export table as PNG (copy to clipboard)
        exportPngBtn.addEventListener('click', () => {
            const printArea = document.getElementById('print-area');
            if (!printArea) return;
            html2canvas(printArea).then(canvas => {
                canvas.toBlob(blob => {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]).then(() => {
                        exportPngBtn.textContent = "Copied PNG!";
                        setTimeout(() => exportPngBtn.textContent = "Export as PNG", 2000);
                    }, () => {
                        alert("Failed to copy PNG to clipboard.");
                    });
                });
            });
        });

        // Export table as RTF (copy to clipboard)
        exportRtfBtn.addEventListener('click', () => {
            const rows = Array.from(testTbody.querySelectorAll('tr'));
            if (rows.length === 0) {
                alert("No allergens selected!");
                return;
            }
            let rtf = '{\rtf1\ansi\deff0\n';
            rtf += '{\b Site}\tab {\b Allergen Name}\tab {\b Location}';
            if (showDay2Check.checked) rtf += '\tab {\b Day 2}';
            if (showDay7Check.checked) rtf += '\tab {\b Day 7}';
            rtf += '\par\n';
            let siteNum = 1;
            rows.forEach((tr, idx) => {
                const cells = Array.from(tr.querySelectorAll('td'));
                rtf += `${siteNum}\tab ${cells[1].textContent}\tab ${cells[2].textContent}`;
                let cellIdx = 3;
                if (showDay2Check.checked) {
                    rtf += `\tab ${cells[cellIdx].querySelector('select').value}`;
                    cellIdx++;
                }
                if (showDay7Check.checked) {
                    rtf += `\tab ${cells[cellIdx].querySelector('select').value}`;
                }
                rtf += '\par\n';
                siteNum++;
            });
            rtf += '}';
            // Copy RTF to clipboard, fallback to plain text if not supported
            if (window.ClipboardItem && navigator.clipboard) {
                const rtfBlob = new Blob([rtf], { type: 'text/rtf' });
                const data = [new ClipboardItem({ 'text/rtf': rtfBlob })];
                navigator.clipboard.write(data).then(() => {
                    exportRtfBtn.textContent = "Copied RTF!";
                    setTimeout(() => exportRtfBtn.textContent = "Export as RTF", 2000);
                }, () => {
                    // Fallback: copy as plain text table
                    let plain = 'Site\tAllergen Name\tLocation';
                    if (showDay2Check.checked) plain += '\tDay 2';
                    if (showDay7Check.checked) plain += '\tDay 7';
                    plain += '\n';
                    let siteNum = 1;
                    rows.forEach((tr, idx) => {
                        const cells = Array.from(tr.querySelectorAll('td'));
                        plain += `${siteNum}\t${cells[1].textContent}\t${cells[2].textContent}`;
                        let cellIdx = 3;
                        if (showDay2Check.checked) {
                            plain += `\t${cells[cellIdx].querySelector('select').value}`;
                            cellIdx++;
                        }
                        if (showDay7Check.checked) {
                            plain += `\t${cells[cellIdx].querySelector('select').value}`;
                        }
                        plain += '\n';
                        siteNum++;
                    });
                    navigator.clipboard.writeText(plain).then(() => {
                        exportRtfBtn.textContent = "Copied as Text!";
                        setTimeout(() => exportRtfBtn.textContent = "Export as RTF", 2000);
                    }, () => {
                        alert("Failed to copy RTF or text to clipboard.");
                    });
                });
            } else {
                alert("Clipboard API not supported for RTF. Try copying as text instead.");
            }
        });
    const seriesSelect = document.getElementById('series-select');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const allergenTbody = document.getElementById('allergen-tbody');
    const testTbody = document.getElementById('test-tbody');
    const testHeaderRow = document.getElementById('test-header-row');
    const clearBtn = document.getElementById('clear-all');
    const printBtn = document.getElementById('print-test');
    const exportListBtn = document.getElementById('export-list');
        // Export selected allergens and interpretations as CSV
        exportListBtn.addEventListener('click', () => {
            const selectedList = Object.keys(selectionState).map(name => ({
                name: name,
                ...selectionState[name]
            }));
            if (selectedList.length === 0) {
                alert("No allergens selected!");
                return;
            }
            let csv = 'Site,Allergen Name,Location';
            if (showDay2Check.checked) csv += ',Day 2';
            if (showDay7Check.checked) csv += ',Day 7';
            csv += '\n';
            let siteNum = 1;
            selectedList.forEach(allergen => {
                let row = `${siteNum},"${allergen.name}",${allergen.location}`;
                if (showDay2Check.checked) row += `,"${allergen.day2 || ''}"`;
                if (showDay7Check.checked) row += `,"${allergen.day7 || ''}"`;
                csv += row + '\n';
                siteNum++;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'patch-test-list.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    const saveSessionBtn = document.getElementById('save-session');
    const loadSessionBtn = document.getElementById('load-session');
    const loadInput = document.getElementById('load-input');
    
    const showDay2Check = document.getElementById('show-day2');
    const showDay7Check = document.getElementById('show-day7');
    const copyNarrativeBtn = document.getElementById('copy-narrative-btn');

    let currentSeries = '';
    
    // Data structure for selections: { name: { day2: 'Normal', day7: 'Normal' } }
    let selectionState = {}; 

    const INTERPRETATIONS = [
        "Normal",
        "1+",
        "2+",
        "3+",
        "Indeterminate/Questionable"
    ];

    // Helper to get all unique allergens across all series
    function getAllAvailableAllergens() {
        const uniqueAllergens = new Map();
        Object.values(allergenData).forEach(series => {
            series.forEach(allergen => {
                if (!uniqueAllergens.has(allergen.name)) {
                    uniqueAllergens.set(allergen.name, allergen);
                }
            });
        });
        return Array.from(uniqueAllergens.values());
    }

    // Initialize series select
    function init() {
        // Filter out unwanted internal keys or series
        const seriesNames = Object.keys(allergenData).filter(name => 
            name !== 'entire 80' && name !== 'AD Series'
        );
        
        seriesNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            seriesSelect.appendChild(option);
        });

        currentSeries = ''; 
        renderAllergens();
        updateGeneratedTest();
    }

    function renderAllergens() {
        allergenTbody.innerHTML = '';
        const allergens = currentSeries === '' ? getAllAvailableAllergens() : allergenData[currentSeries];
        const searchTerm = searchInput.value.toLowerCase();

        allergens.forEach(allergen => {
            if (allergen.name.toLowerCase().includes(searchTerm) || 
                allergen.location.toLowerCase().includes(searchTerm)) {
                
                const tr = document.createElement('tr');
                const isSelected = selectionState.hasOwnProperty(allergen.name);
                if (isSelected) tr.classList.add('selected');

                tr.innerHTML = `
                    <td><input type="checkbox" ${isSelected ? 'checked' : ''}></td>
                    <td>${allergen.name}</td>
                    <td>${allergen.location}</td>
                `;

                tr.querySelector('input').addEventListener('change', (e) => {
                    if (e.target.checked) {
                        selectionState[allergen.name] = { day2: 'Normal', day7: 'Normal', location: allergen.location };
                        tr.classList.add('selected');
                    } else {
                        delete selectionState[allergen.name];
                        tr.classList.remove('selected');
                    }
                    updateGeneratedTest();
                });

                allergenTbody.appendChild(tr);
            }
        });
    }

    function updateGeneratedTest() {
        // Update Headers
        testHeaderRow.innerHTML = '<th>Site</th><th>Allergen Name</th><th>Location</th>';
        if (showDay2Check.checked) testHeaderRow.innerHTML += '<th>Day 2</th>';
        if (showDay7Check.checked) testHeaderRow.innerHTML += '<th>Day 7</th>';

        testTbody.innerHTML = '';
        
        const selectedList = Object.keys(selectionState).map(name => ({
            name: name,
            ...selectionState[name]
        }));

        // Sort by Location # numerically
        selectedList.sort((a, b) => {
            const locA = parseInt(a.location) || 0;
            const locB = parseInt(b.location) || 0;
            if (locA !== locB) return locA - locB;
            return a.name.localeCompare(b.name);
        });

        let siteNum = 1;
        selectedList.forEach(allergen => {
            const tr = document.createElement('tr');
            const currentSite = siteNum++;
            
            let rowHtml = `
                <td>${currentSite}</td>
                <td>${allergen.name}</td>
                <td>${allergen.location}</td>
            `;

            if (showDay2Check.checked) {
                rowHtml += `<td>${createInterpretationSelect(allergen.name, 'day2')}</td>`;
            }
            if (showDay7Check.checked) {
                rowHtml += `<td>${createInterpretationSelect(allergen.name, 'day7')}</td>`;
            }

            tr.innerHTML = rowHtml;
            testTbody.appendChild(tr);

            // Re-attach observers to selects
            tr.querySelectorAll('select').forEach(sel => {
                sel.value = allergen[sel.dataset.day];
                sel.addEventListener('change', (e) => {
                    selectionState[allergen.name][e.target.dataset.day] = e.target.value;
                });
            });
        });
    }

    function createInterpretationSelect(allergenName, day) {
        let options = INTERPRETATIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        return `<select class="interpretation-select" data-name="${allergenName}" data-day="${day}">${options}</select>`;
    }

    const copyTableBtn = document.getElementById('copy-table-btn');
    
    copyTableBtn.addEventListener('click', () => {
        const rows = Array.from(testTbody.querySelectorAll('tr'));
        if (rows.length === 0) {
            alert("No allergens selected!");
            return;
        }

        const d2Active = showDay2Check.checked;
        const d7Active = showDay7Check.checked;

        let htmlTable = `
            <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 9pt; line-height: 1; border: none;">
                <thead>
                    <tr style="background-color: #3498db; color: white; mso-line-height-rule: exactly;">
                        <th style="border: 0.5pt solid #000; padding: 2px; text-align: left;">Site</th>
                        <th style="border: 0.5pt solid #000; padding: 2px; text-align: left;">Allergen Name</th>
                        <th style="border: 0.5pt solid #000; padding: 2px; text-align: left;">Location</th>
                        ${d2Active ? '<th style="border: 0.5pt solid #000; padding: 2px;">Day 2</th>' : ''}
                        ${d7Active ? '<th style="border: 0.5pt solid #000; padding: 2px;">Day 7</th>' : ''}
                    </tr>
                </thead>
                <tbody>
        `;

        rows.forEach((tr, index) => {
            const cells = Array.from(tr.querySelectorAll('td'));
            const bgColor = (index % 2 === 0) ? "#ffffff" : "#f2f2f2";
            
            htmlTable += `<tr style="background-color: ${bgColor}; mso-line-height-rule: exactly;">`;
            htmlTable += `<td style="border: 0.5pt solid #000; padding: 1px 2px; white-space: nowrap;">${cells[0].textContent}</td>`;
            htmlTable += `<td style="border: 0.5pt solid #000; padding: 1px 2px;">${cells[1].textContent}</td>`;
            htmlTable += `<td style="border: 0.5pt solid #000; padding: 1px 2px; white-space: nowrap;">${cells[2].textContent}</td>`;
            
            if (d2Active) {
                const val = cells[3].querySelector('select').value;
                htmlTable += `<td style="border: 0.5pt solid #000; padding: 1px 2px;">${val}</td>`;
            }
            if (d7Active) {
                const cellIdx = d2Active ? 4 : 3;
                const val = cells[cellIdx].querySelector('select').value;
                htmlTable += `<td style="border: 0.5pt solid #000; padding: 1px 2px;">${val}</td>`;
            }
            htmlTable += `</tr>`;
        });

        htmlTable += '</tbody></table>';
        copyRichText(htmlTable);
    });

    copyNarrativeBtn.addEventListener('click', () => {
        const allergens = Object.keys(selectionState);
        if (allergens.length === 0) {
            alert("No allergens selected!");
            return;
        }

        const d2Active = showDay2Check.checked;
        const d7Active = showDay7Check.checked;
        
        const abnormalities = [];
        
        allergens.forEach(name => {
            const state = selectionState[name];
            const isAbnormalD2 = d2Active && state.day2 !== 'Normal';
            const isAbnormalD7 = d7Active && state.day7 !== 'Normal';
            
            if (isAbnormalD2 || isAbnormalD7) {
                let note = `${name}`;
                if (isAbnormalD2 && isAbnormalD7) {
                    note += `: ${state.day2} (Day 2), ${state.day7} (Day 7)`;
                } else if (isAbnormalD2) {
                    note += `: ${state.day2} (Day 2)`;
                } else if (isAbnormalD7) {
                    note += `: ${state.day7} (Day 7)`;
                }
                abnormalities.push(note);
            }
        });

        let text = "PATCH TEST INTERPRETATION:\n";
        if (abnormalities.length > 0) {
            text += "Abnormal results were identified for the following allergens:\n";
            abnormalities.forEach(a => text += `- ${a}\n`);
            text += "\nThe remainder of the patches applied were normal/negative.";
        } else {
            text += "All patches applied were normal/negative with no abnormal reactions identified.";
        }

        copyToClipboard(text, copyNarrativeBtn, "Copied Narrative!");
    });

    function copyToClipboard(text, btn, successMsg) {
        // Fallback for non-secure contexts or older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const originalText = btn.textContent;
                btn.textContent = successMsg;
                setTimeout(() => btn.textContent = originalText, 2000);
            } else {
                throw new Error('execCommand failed');
            }
        } catch (err) {
            // Last resort: try the modern API if standard copy fails
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = successMsg;
                    setTimeout(() => btn.textContent = originalText, 2000);
                });
            }
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // Toggle helpers
    [showDay2Check, showDay7Check].forEach(check => {
        check.addEventListener('change', updateGeneratedTest);
    });

    function copyRichText(html) {
        const container = document.createElement('div');
        container.innerHTML = html;
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        document.body.appendChild(container);
        const range = document.createRange();
        range.selectNode(container);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            document.execCommand('copy');
            const originalText = copyTableBtn.textContent;
            copyTableBtn.textContent = "Copied Table!";
            setTimeout(() => copyTableBtn.textContent = originalText, 2000);
        } finally {
            selection.removeAllRanges();
            document.body.removeChild(container);
        }
    }

    seriesSelect.addEventListener('change', (e) => {
        currentSeries = e.target.value;
        selectionState = {}; 
        
        if (currentSeries === '80 Series') {
            allergenData[currentSeries].forEach(a => {
                if (a.name.toLowerCase() !== 'titanium') {
                    selectionState[a.name] = { day2: 'Normal', day7: 'Normal', location: a.location };
                }
            });
        } else if (currentSeries !== '') {
            allergenData[currentSeries].forEach(a => {
                if (a.selected) {
                    selectionState[a.name] = { day2: 'Normal', day7: 'Normal', location: a.location };
                }
            });
        }
        
        renderAllergens();
        updateGeneratedTest();
    });

    searchInput.addEventListener('input', () => {
        clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
        renderAllergens();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        renderAllergens();
    });

    clearBtn.addEventListener('click', () => {
        selectionState = {};
        renderAllergens();
        updateGeneratedTest();
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    saveSessionBtn.addEventListener('click', () => {
        const sessionData = {
            currentSeries: currentSeries,
            selectionState: selectionState,
            showDay2: showDay2Check.checked,
            showDay7: showDay7Check.checked
        };

        const fileName = prompt("Enter a filename for your session:", "patch-test-session") || "patch-test-session";
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    loadSessionBtn.addEventListener('click', () => {
        loadInput.click();
    });

    loadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                // Restore state
                currentSeries = data.currentSeries || '';
                selectionState = data.selectionState || {};
                showDay2Check.checked = !!data.showDay2;
                showDay7Check.checked = !!data.showDay7;
                
                // Update UI elements to reflect state
                seriesSelect.value = currentSeries;
                
                renderAllergens();
                updateGeneratedTest();
                
                // Reset input for next time
                loadInput.value = '';
                alert("Session loaded successfully!");
            } catch (err) {
                console.error("Error loading session:", err);
                alert("Failed to load session. Please ensure the file is a valid JSON exported from this app.");
            }
        };
        reader.readAsText(file);
    });

    init();
});
