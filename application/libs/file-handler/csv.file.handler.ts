import FileHandler from "./file.handler";
import { json2csv } from 'json-2-csv';
export default class CSVFileHandler extends FileHandler {
    constructor() {
        super()
    }

    rawToCSV (rawData:object[]): string {
        const csvTransformedData = json2csv(rawData)
        return csvTransformedData
    }

    writeCSVFile (filename: string, fileData: string): string  {
        const fName = this.sanitizeFilename(filename)
        this.writeFile(fName, fileData)
        return fName
    }

    private sanitizeFilename (rawfileName: string): string {
        const now = new Date()
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        const filename = `${rawfileName}_${formattedDateTime}.csv`;

        return filename
    }
}