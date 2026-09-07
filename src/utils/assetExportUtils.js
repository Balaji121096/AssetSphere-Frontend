export const HARDWARE_EXPORT_COLUMNS = [
    ["Asset ID", ["asset_id", "id"]],
    ["Asset Code", ["asset_code"]],
    ["Asset Name", ["asset_name", "name"]],
    ["Category", ["category_name", "category"]],
    ["Brand", ["brand"]],
    ["Model", ["model"]],
    ["Serial Number", ["serial_number", "serial_no"]],
    ["Processor", ["processor", "cpu", "processor_name"]],
    ["RAM", ["ram", "ram_size", "memory"]],
    ["Storage", ["storage", "storage_size", "disk", "hard_disk"]],
    ["MAC Address", ["mac_address", "mac"]],
    ["IP Address", ["ip_address", "ip"]],
    ["Hostname", ["hostname", "computer_name"]],
    ["Operating System", ["operating_system", "os", "os_version"]],
    ["Service Tag", ["service_tag", "service_tag_number"]],
    ["Employee", ["display_name", "employee_name", "assigned_employee", "employee"]],
    ["Department", ["department_name", "department"]],
    ["Designation", ["designation_name", "designation"]],
    ["Vendor", ["vendor_name", "vendor"]],
    ["Invoice Number", ["invoice_number", "invoice_no", "invoice"]],
    ["Location", ["location_name", "location"]],
    ["Floor", ["floor", "floor_name"]],
    ["Purchase Date", ["purchase_date", "purchased_date"]],
    ["Purchase Cost", ["purchase_cost", "cost", "amount"]],
    ["Warranty Expiry", ["warranty_expiry", "warranty_end_date"]],
    ["Assigned Date", ["assigned_date"]],
    ["Returned Date", ["returned_date"]],
    ["Status", ["asset_status", "status"]],
    ["Remarks", ["remarks", "notes"]]
];

export const getExportValue = (asset, aliases) => {
    for (const key of aliases) {
        const value = asset?.[key];
        if (value !== null && value !== undefined && value !== "") {
            return value;
        }
    }
    return "";
};

export const formatExportDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-IN");
};

export const getHardwareExportRows = (assets) =>
    assets.map((asset) =>
        HARDWARE_EXPORT_COLUMNS.map(([label, aliases]) => {
            const value = getExportValue(asset, aliases);
            return label.endsWith("Date") ? formatExportDate(value) : value;
        })
    );

export const getHardwareExportHeaders = () =>
    HARDWARE_EXPORT_COLUMNS.map(([label]) => label);

export const escapeXml = (value) =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");

export const buildExcelXml = (headers, rows) => {
    const rowXml = (cells) =>
        `<Row>${cells
            .map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`)
            .join("")}</Row>`;

    return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
    <Worksheet ss:Name="Hardware Assets">
        <Table>
            ${rowXml(headers)}
            ${rows.map(rowXml).join("")}
        </Table>
    </Worksheet>
</Workbook>`;
};
