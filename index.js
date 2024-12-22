$(function () {

    var parseData = $([]).toArray();

    let rootFavorites = $('body > dl > dt > dl > dt > h3');
    recursiveParse(rootFavorites);

    function recursiveParse(folderTag, parentFolderPath) {
        $.each(folderTag, (i, e) => {
            let currentFolderPath = parentFolderPath != null && parentFolderPath != '' ? `${parentFolderPath},${$(e).text()}` : $(e).text();
            let tags = $(e).next('dl').children('dt').children('a');
            let subFavorites = $(e).next('dl').children('dt').children('h3');
            $.each(tags, (tagIndex, tagE) => {
                let $tag = $(tagE);
                parseData.push({
                    title: $tag.text(),
                    url: $tag.attr('href'),
                    tag: $(e).text(),
                    path: currentFolderPath
                });
            });

            if (subFavorites.length >= 0) {
                recursiveParse(subFavorites, currentFolderPath);
            }

        });
    }

    function convertToHoarderJson(data) {
        //TODO:
    }

});