module.exports.setErrorPage = (req, res, next) => {
    res.render('error', {
        title: 'Error 404',
        path: '/error'
    })
}