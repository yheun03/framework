/**
 * 코드 값 → 상태 태그 색 (AppTag tone: success · info · warning · danger · gray)
 *
 * <AppTag variant="soft" dot :tone="codeTone('WO_STATUS', row.status)" :label="row.statusName" />
 *
 * - 서버는 코드(status)와 이름(statusName)만 주고, 색은 화면 규칙이라 여기 한 곳에서 정합니다. (API_GUIDE 8장)
 * - 그룹 이름은 공통코드 그룹(GET /api/codes/{그룹})과 같게 씁니다. 없는 값은 gray.
 * - 아래는 예제 화면용입니다. 프로젝트의 코드 그룹으로 바꿔 씁니다.
 */
export const CODE_TONE = {
    WO_STATUS: { waiting: 'gray', working: 'info', done: 'success', stopped: 'danger' },
    SO_STATUS: { confirmed: 'success', working: 'info', warning: 'warning', done: 'gray' },
    PO_STATUS: { partial: 'info', delayed: 'warning', done: 'success' },
    STOCK_STATUS: { normal: 'success', shortage: 'warning' },
    PLAN_STATUS: { confirmed: 'success', overload: 'warning', unassigned: 'gray' },
    QI_RESULT: { pass: 'success', conditional: 'warning', fail: 'danger' },
    ALARM_LEVEL: { critical: 'danger', warning: 'warning', notice: 'info' },
};

/**
 * @param {string} group 코드 그룹
 * @param {string} value 코드 값
 * @returns {string} AppTag tone
 */
export function codeTone(group, value) {
    return CODE_TONE[group]?.[value] ?? 'gray';
}
