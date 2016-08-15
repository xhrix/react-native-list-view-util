/**
 * @author xhrix <xxxhrixxx@gmail.com>
 */

import {List} from 'linqts';

/**
 * Utility functions for the 'ListView' component of React Native.
 *
 * This functions are compatible with React Native v0.31, and may or may not be compatible with future versions.
 *
 * To learn more about React Native's ListView, visit:
 * https://facebook.github.io/react-native/docs/listview.html
 * https://facebook.github.io/react-native/docs/listviewdatasource.html
 */
export default class ReactNativeListViewUtil {

    /**
     * Formats and returns a 'dataBlob', 'sectionIDs', and 'rowIDs' used to build a 'ListView' with sticky headers.
     *
     * @param dataCollection Array of data of a type used to fill the list view.
     * @param getSectionData Function to select what data to use as the section data.
     * @param getRowData Function to select what data to use as the row data.
     * @param grouper Function to group the elements of 'dataCollection'.
     * @return {{dataBlob: {}, sectionIDs: Array, rowIDs: Array}}
     */
    static getDataBlobSectionIDsAndRowIDs<T, TGrouping, TSectionData, TRowData>(dataCollection: T[],
                                                                                getSectionData: (entry: T) => TSectionData,
                                                                                getRowData: (entry: T) => TRowData,
                                                                                grouper: (entry: T) => TGrouping) {

        /**
         * Object containing the contents for all the sections and rows, identified by an id.
         * @type {{}}
         */
        var dataBlob = {};

        /**
         *  Uni-dimensional array with the ids of the section data in the 'dataBlob'.
         * @type {[]}
         */
        var sectionIDs = [];

        /**
         *  Bi-dimensional array with the ids of the row data in the 'dataBlob'.
         *      The first level of the array corresponds to a 'sectionID'.
         *      The second level of the array corresponds to the 'rowIDs'.
         * @type {[][]}
         */
        var rowIDs = [];

        // First lets group the data so we can get the 'sticky headers' (or sections).
        let groupedData = new List(dataCollection).GroupBy(grouper, x=>x);

        var groupCounter = -1;

        for (var groupKey in groupedData) {

            if (!groupedData.hasOwnProperty(groupKey)) continue;

            ++groupCounter;

            let group = groupedData[groupKey];

            // Add the section ID, using the group counter (int) as ID of the section.
            sectionIDs.push(groupCounter);

            // Prepare the 2D array of row IDs.
            rowIDs[groupCounter] = [];

            // Update the data blob with the sticky header (or section) content.
            // All the guys of the group will return the same value when calling 'getSectionData'. Pck the first one.
            dataBlob[groupCounter] = getSectionData(group[0]);

            var entryCounter = -1;

            // Loop through all the elements in the group.
            for (var entry of group) {

                ++entryCounter;

                // Create the row's ID, which is just a string combining the section's ID where the row lives, a comma,
                // and the index of the row inside the group, this way we ensure this ID is unique though all the
                // 'dataBlob'.
                let rowID = `${groupCounter},${entryCounter}`;
                rowIDs[groupCounter].push(rowID);

                // Update the data blog with the row's content.
                dataBlob[rowID] = getRowData(entry);
            }
        }

        return {dataBlob: dataBlob, sectionIDs: sectionIDs, rowIDs: rowIDs};
    }
}