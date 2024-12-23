//https://github.com/WuMortal/HoarderHTMLConverterJson

$(function () {

    var htmlText = '';
    var parseData = $([]).toArray();
    var hoarderData = {};

    $('#app-content-file-select').change(function () {
        if (this.files.length <= 0) {
            $('.app-content-result-download').hide();
            $('.app-content-file-parse').attr('disabled', true);
            return;
        }
        let file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                htmlText = e.target.result;
                if (htmlText.indexOf('<!DOCTYPE NETSCAPE-Bookmark-file-1>') <= -1) {
                    $('.app-content-result-text').val('html file is not valid!');

                    $('.app-content-file-parse').attr('disabled', true);
                    return;
                }
                $('.app-content-file-parse').attr('disabled', false);
                $('.app-content-result-text').val('html is valid,please click [Convert] button.');
            };
            reader.readAsText(file);
        }

    });

    $('.app-content-file-parse').click(function () {
        if (htmlText == null || htmlText == '') {
            $('.app-content-result-text').val('not found file!');
            $('.app-content-result-download').hide();
            return;
        }

        $('.app-content-file-parse').attr('disabled', true);

        const html = $.parseHTML(htmlText);
        let rootFavorites = $(html).children('dt').children('dl').children('dt').children('h3');
        recursiveParse(rootFavorites);
        hoarderData = convertToHoarder(parseData);
        $('.app-content-result-text').val(JSON.stringify(hoarderData, null, 4));

        $('.app-content-result-download').show();
        $('.app-content-file-parse').attr('disabled', false);
    });

    $('.app-content-result-download').click(function () {
        var a = document.createElement('a');
        a.download = `hoarder_${new Date().getTime()}.json`;
        a.href = URL.createObjectURL(new Blob([JSON.stringify(hoarderData, null, 4)], {type: "application/json"}));
        a.click();        
    });

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

    function convertToHoarder(data) {
        if (data.length <= 0) {
            return [];
        }

        var bookmarks = data.map(e => {
            return {
                'createdAt': Math.floor(new Date().getTime() / 1000),
                'title': e.title,
                'tags': e.path ? e.path.split(',') : [],
                "content": {
                    "type": "link",
                    "url": e.url
                },
                "note": null
            };
        });

        return {
            "bookmarks": bookmarks
        }
    }
});