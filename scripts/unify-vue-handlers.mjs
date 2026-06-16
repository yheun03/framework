/**
 * Vue 파일의 이벤트 핸들러 이름을 handle 접두사 규칙으로 통일합니다.
 */
import fs from 'node:fs';
import path from 'node:path';

const RENAMES = [
    ['onSubmit', 'handleSubmit'],
    ['onInput', 'handleInput'],
    ['onChange', 'handleChange'],
    ['onTextareaInput', 'handleTextareaInput'],
    ['onFileChange', 'handleFileChange'],
    ['onDragEnter', 'handleDragEnter'],
    ['onDragOver', 'handleDragOver'],
    ['onDragLeave', 'handleDragLeave'],
    ['onDrop', 'handleDrop'],
    ['openFile', 'handleFileOpen'],
    ['clearAll', 'handleClearAll'],
    ['previewItem', 'handlePreviewItem'],
    ['previewPdf', 'handlePreviewPdf'],
    ['removeItem', 'handleRemoveItem'],
    ['clearValue', 'handleClear'],
    ['togglePassword', 'handlePasswordToggle'],
    ['setPageSize', 'handlePageSizeChange'],
    ['setPage', 'handlePageChange'],
    ['onBodyScroll', 'handleBodyScroll'],
    ['onGridReady', 'handleGridReady'],
    ['closeOpenSelects', 'handleCloseOpenSelects'],
    ['onFlatpickrChange', 'handleFlatpickrChange'],
    ['setFieldValue', 'handleFieldValueChange'],
    ['toggleCheckboxValue', 'handleCheckboxToggle'],
    ['setCellValue', 'handleCellValueChange'],
    ['setOpenIds', 'handleOpenIdsChange'],
    ['toggleItem', 'handleItemToggle'],
    ['onDocumentClick', 'handleDocumentClick'],
    ['onDocumentKeydown', 'handleDocumentKeydown'],
    ['onCloseAll', 'handleCloseAll'],
    ['selectValue', 'handleSelectValue'],
    ['setActiveId', 'handleActiveIdChange'],
    ['onTabKeydown', 'handleTabKeydown'],
    ['selectItem', 'handleSelectItem'],
    ['goHome', 'handleGoHome'],
    ['goBack', 'handleGoBack'],
    ['goToPreviousPage', 'handlePreviousPage'],
    ['goToNextPage', 'handleNextPage'],
    ['zoomOut', 'handleZoomOut'],
    ['zoomIn', 'handleZoomIn'],
    ['downloadAll', 'handleDownloadAll'],
    ['downloadSelected', 'handleDownloadSelected'],
    ['applySearch', 'handleSearch'],
    ['resetGrid', 'handleReset'],
    ['emitFieldAction', 'handleFieldAction'],
    ['setTheme', 'handleThemeChange'],
    ['setLocale', 'handleLocaleChange'],
    ['openNav', 'handleNavOpen'],
    ['closeNav', 'handleNavClose'],
    ['onClickTab', 'handleTabClick'],
    ['closeOtherTabs', 'handleCloseOtherTabs'],
    ['moveToLeftTab', 'handleMoveToLeftTab'],
    ['moveToRightTab', 'handleMoveToRightTab'],
    ['onClickRow', 'handleRowClick'],
    ['toggleOpen', 'handleToggleOpen'],
    ['onClose', 'handleTabClose'],
];

function collect(dir) {
    const abs = path.resolve(dir);
    if (!fs.existsSync(abs)) return [];
    const st = fs.statSync(abs);
    if (st.isFile() && abs.endsWith('.vue')) return [abs];
    if (!st.isDirectory()) return [];
    return fs.readdirSync(abs, {withFileTypes: true}).flatMap((e) => {
        if (!e.isDirectory() && !e.name.endsWith('.vue')) return [];
        return collect(path.join(abs, e.name));
    });
}

function applyRenames(content) {
    let next = content;

    // AppSelect toggle — 함수/바인딩만 (emit 이름 제외)
    next = next.replace(/function toggle\(\)/g, 'function handleToggle()');
    next = next.replace(/@click="toggle"/g, '@click="handleToggle"');
    next = next.replace(/\btoggle\(\)/g, 'handleToggle()');

    // AppInput clear
    next = next.replace(/function clear\(\)/g, 'function handleClear()');
    next = next.replace(/@click="clear"/g, '@click="handleClear"');

    for (const [from, to] of RENAMES) {
        const re = new RegExp(`\\b${from}\\b`, 'g');
        next = next.replace(re, to);
    }

    return next;
}

const roots = ['pages', 'layouts', 'components', 'app.vue', 'error.vue'];
const files = roots.flatMap((r) => collect(r));
let changed = 0;

for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const next = applyRenames(original);
    if (next !== original) {
        fs.writeFileSync(file, next);
        changed += 1;
        console.log(`renamed: ${path.relative(process.cwd(), file)}`);
    }
}

console.log(`done: ${changed} file(s) updated`);
