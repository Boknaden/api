const campuses = [
        'Vestfold',
        'Bø',
        'Drammen',
        'Kongsberg',
        'Notodden',
        'Porsgrunn',
        'Rauland',
        'Ringerike',
        'Nettstudier',
    ]
var uri = 'https://www.usn.no/service.php?targetTileId=6784&service=article.getarticlesbyfilter&templateId%5B%5D=7&runtimeCategoryId=26891&doItemCount=1&offset=0&sortOrder=&categories=26891&rootcid=26891&filter%5Bvfilter1%5D=&filter%5BapplicationDate%5D%5Bfrom%5D=&filter%5BapplicationDate%5D%5Bto%5D=&filter%5BdepCode%5D=&filter%5Bsearchable%5D=&filter%5BtypeOfFinanciation%5D=&filter%5BeducationalLevel%5D=&filter%5Bcampus%5D=Vestfold&filter%5BnewStartup%5D=&filter%5BeducationalType%5D=&_=1490133310738'

module.exports = {
    path: 'data/',
    prefix: 'campus',
    campuses: campuses,
    uri: uri,
}
