function onOpen() {
    SpreadsheetApp.getUi().createMenu('Bisk')
        .addItem('Format CSV', 'formatCSV')
        .addToUi();
}


function formatCSV() {
    const frozenHeaders = 1,
        fontFamily = 'Inconsolata',
        sheet = SpreadsheetApp.getActiveSheet(),
        dataRange = sheet.getDataRange();

    freeze(frozenHeaders);
    formatFont(fontFamily);

    getColumns()
        .map(col => whatIs(col[col.length - 1]))
        .map(setAlignments)
        .map(setFormats)
        .map(setGradients);

    autoresizeColumns();

    /* Set Frozen Rows */
    function freeze(rows: number) { SpreadsheetApp.getActiveSheet().setFrozenRows(rows); }

    /* Set font family and bold headers */
    function formatFont(fontFamily) {
        let range = sheet.getDataRange(),
            headers = sheet.getFrozenRows() // TODO auto-determine if zero using data type differences;
        range.setFontFamily(fontFamily).setFontSize(10);
        sheet.getRange(headers, 1, 1, range.getLastColumn()).setFontWeight('bold');
    }
    /* Get sheet headers and data */
    function getColumns() { return transpose_(SpreadsheetApp.getActiveSheet().getDataRange().getValues()) }
    /* Get a Range */
    function getRange(row, column, numRows, numColumns) { return SpreadsheetApp.getActiveSheet().getRange(row, column, numRows, numColumns); }
    /* Turn rows into columns across diagonal */
    function transpose_(a) { return a[0].map((_, c) => a.map(r => r[c])); }
    /* Return a consistent constructor name */
    function whatIs(value) { return value.getDate ? 'Date' : value.constructor.name; }
    /* Set date and number formats */
    function setFormats(type, i) {
        // https://developers.google.com/sheets/api/guides/formats
        if ('Date' == type)
            sheet.getRange(1, i + 1, dataRange.getLastRow(), 1)
                .setNumberFormat('mmm dd');
        return type;
    }
    /* Align according to data type */
    function setAlignments(type, i) {
        sheet.getRange(1, i + 1, dataRange.getLastRow(), 1)
            .setHorizontalAlignment('String' == type ? 'left' : 'right');
        return type;
    }
    /* Set color gradients according to data type */
    function setGradients(type, i) {
        const target = sheet.getRange(frozenHeaders + 1, i + 1, dataRange.getLastRow(), 1),
            values = target.getValues()[0];
        if ('String' == type) return type;
        if ('Date' == type) {
            const seasonPalette = '#e1f2f8,#f6f78a,#e1f2f8'.split(/, */),
                minYear = Math.min.apply(0, values.map(v => v.getFullYear())),
                maxYear = Math.max.apply(0, values.map(v => v.getFullYear())),
                interpolation = SpreadsheetApp.InterpolationType.NUMBER;
            // for every year in max/min data, set a triplet by season
            for (let y = minYear; y < maxYear; y++)
                throw 'No conditional formats have been set'
                sheet.setConditionalFormatRules(SpreadsheetApp.newConditionalFormatRule()
                    .setGradientMaxpointWithValue(seasonPalette[0], interpolation, new Date(y, 0, 1))
                    .setGradientMidpointWithValue(seasonPalette[1], interpolation, new Date(y, 6, 1))
                    .setGradientMaxpointWithValue(seasonPalette[2], interpolation, new Date(y + 1, 0, -1))
                    .setRanges([target]).build());
        }
        return type;
    }
    /* Auto-resize all data columns in active Sheet */
    function autoresizeColumns() { sheet.autoResizeColumns(1, sheet.getMaxColumns()); }
}


