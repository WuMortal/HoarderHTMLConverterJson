$(function () {

    var result = $([]).toArray();

    let rootFavorites = $('body > dl > dl > dt:nth-child(3) > h3');
    $.each(rootFavorites, (i, e) => {
        let tags = $(e).next('dl').children('dt').children('a');
        let subFavorites = $(e).siblings('dl').find('dt > h3');
        $.each(tags, (tagIndex, tagE) => {
            let $tag = $(tagE);
            result.push({
                title: $tag.text(),
                url: $tag.attr('href'),
                tag: $(e).text()
            });
        });


    });
    console.log(result);

});