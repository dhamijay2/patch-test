document.addEventListener('DOMContentLoaded', () => {
    const seriesSelect = document.getElementById('series-select');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const allergenTbody = document.getElementById('allergen-tbody');
    const testTbody = document.getElementById('test-tbody');
    const testHeaderRow = document.getElementById('test-header-row');
    const clearBtn = document.getElementById('clear-all');
    const printBtn = document.getElementById('print-test');
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
