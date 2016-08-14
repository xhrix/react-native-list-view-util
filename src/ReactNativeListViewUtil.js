/**
 * @author xhrix <xxxhrixxx@gmail.com>
 */

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
     * @param ungroupedData An array of data of a type to fill the columns.
     * @param sectionDataSelector Function to select what data to use as the section data.
     * @param sectionDataComparer FUnction to compare the header data and determine if it's other header.
     * @param rowDataSelector Function to select what data to use as the row data.
     * @return {{dataBlob: {}, sectionIDs: Array, rowIDs: Array}}
     */
    static getDataBlobSectionIDsAndRowIDs<T, TSection, TRow>(ungroupedData: T[],
                                                             sectionDataSelector: (entry: T) => TSection,
                                                             sectionDataComparer: (a: TSection, b: TSection) => boolean,
                                                             rowDataSelector: (entry: T) => TRow,) {

        /**
         * Object containing the contents for all the sections and rows, identified by an id.
         * @type {{}}
         */
        var dataBlob = {};

        /**
         *  Uni-dimensional array with the ids of the section data in the 'dataBlob'.
         * @type {Array}
         */
        var sectionIDs = [];

        /**
         *  Bi-dimensional array with the ids of the row data in the 'dataBlob'.
         *      The first level of the array corresponds to a 'sectionID'.
         *      The second level of the array corresponds to the 'rowIDs'.
         * @type {Array}
         */
        var rowIDs = [];

        // First lets group the data so we can get the 'sticky headers' (or sections).
        let groupedData = ungroupedData.groupBy(sectionDataSelector, sectionDataComparer);

        var groupIndex = -1;

        for (var group of groupedData) {

            ++groupIndex;

            // Add the section ID, using the group index (int) as ID of the section.
            sectionIDs.push(groupIndex);

            // Prepare the 2D array of row IDs.
            rowIDs[groupIndex] = [];

            // Update the data blob with the sticky header (or section) content.
            // All the guys of the group will return the same value when calling 'sectionDataSelector'. Pck the first one.
            dataBlob[groupIndex] = sectionDataSelector(group[0]);

            var entryIndex = -1;

            // Loop through all the elements in the group.
            for (var entry of group) {

                ++entryIndex;

                // Create the row's ID, which is just a string combining the section's ID where the row lives, a comma,
                // and the index of the row inside the group, this way we ensure this ID is unique though all the
                // 'dataBlob'.
                let rowID = `${groupIndex},${entryIndex}`;
                rowIDs[groupIndex].push(rowID);

                // Update the data blog with the row's content.
                dataBlob[rowID] = rowDataSelector(entry);
            }
        }
        return {dataBlob: dataBlob, sectionIDs: sectionIDs, rowIDs: rowIDs};
    }
}