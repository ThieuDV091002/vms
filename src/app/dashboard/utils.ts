import { BehaviorSubject } from "rxjs";

export class DashboardUtils {
    static refreshCalendar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    static recalculateTableSize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    static findArrayDifference(oldArray, newArray) {
        let toAdd = [];
        const toUpdate = [];
        const toDelete = [];

        // remove empty object {}
        oldArray = oldArray.filter(item => item.mediaType);
        newArray = newArray.filter(item => item.mediaType);

        // to add for item not have id
        toAdd = newArray.filter(item => !item.id);
        newArray = newArray.filter(item => item.id).filter(item => Object.keys(item).length !== 0);

        const oldMap = new Map(oldArray.map(item => [item.id, item]));
        const newMap = new Map(newArray.map(item => [item.id, item]));

        // Find items to add or update
        newMap.forEach((newItem, id) => {
            if (JSON.stringify(newItem) !== JSON.stringify(oldMap.get(id))) {
                toUpdate.push(newItem);
            }
        });

        // Find items to delete
        oldMap.forEach((oldItem, id) => {
            if (!newMap.has(id)) {
                toDelete.push(oldItem);
            }
        });

        return { toAdd, toUpdate, toDelete };
    }

    static getUserDisplayName(user: any) {
        if (!user) { return ''; }
        if (user.surname && user.name) {
            return `${user.surname}, ${user.name}`;
        } else if (user.name) {
            return user.name;
        } else {
            return user.userName;
        }
    }

    /**
     * Checks if a given filename corresponds to an image file based on its extension.
     * @param fileName The name of the file to check.
     * @returns True if the file is an image, false otherwise.
     */
    static isImageFile(fileName: string): boolean {
        if (!fileName) { return false }
        // List of known image file extensions
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];

        // Extract the file extension from the filename
        const extension = fileName.split('.').pop()?.toLowerCase();

        // Check if the extracted extension is in the list of image extensions
        return extension ? imageExtensions.includes(extension) : false;
    }

    static convertBase64ToBlob(base64Str: string) {
        const byteCharacters = atob(base64Str);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        return blob;
    }

    /**
 * Calculate start date and labels for site huddle monthly view
 * @returns Date range and Labels
 */
    static calculateDateRangeAndLabelsByCurrentDate() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const currentDay = currentDate.getDate();
        const dateRange = {
            startDate: new Date(),
            endDate: new Date()
        }

        // calculate the date one year ago
        const oneYearAgo = new Date(currentYear - 1, currentMonth - 1, currentDay);

        // if the current date is the last day of February, set one year ago to the last day of February of the previous year
        if (currentMonth === 2 && currentDay === 29) {
            oneYearAgo.setDate(0); // set to the last day of the previous month (January)
        }

        // set the date range
        dateRange.startDate = oneYearAgo;
        dateRange.endDate = currentDate;

        // generate labels for the last 12 months
        const labels = [];
        const startMonth = currentDay === 1 ? currentMonth - 1 : currentMonth;
        for (let i = 0; i < 12; i++) {
            const adjustedMonth = startMonth - i - 1;
            const year = currentYear + Math.floor(adjustedMonth / 12);
            const month = ((adjustedMonth % 12) + 12) % 12 + 1;

            // Calculate the last day of the current month
            const lastDayOfMonth = new Date(year, month, 0).getDate();
            const day = currentDay === 1 ? lastDayOfMonth : Math.min(currentDay, lastDayOfMonth); // Use the smaller value between currentDay and lastDayOfMonth

            labels.unshift({ year, month, day });
        }

        // console.log('Date Range:', dateRange);
        // console.log('Labels:', labels);

        return { dateRange: dateRange, labels: labels };
    }
}