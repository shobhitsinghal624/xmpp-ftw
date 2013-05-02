var ltx     = require('ltx'),
    builder = require('node-xmpp')

var NS_XHTML    = 'http://www.w3.org/1999/xhtml',
    NS_XHTML_IM = 'http://jabber.org/protocol/xhtml-im'

var XHTML = 'xhtml',
    PLAIN = 'plain'

var buildStanza = function(request, data, caller) {
    if (!request.content)
        return caller._clientError("Message content not provided", data)

    var format = (request.format && (XHTML == request.format)) ?
        XHTML : PLAIN
    var plainMessage = request.content
    if (XHTML == format) {
        try {
            var attrs       = {xmlns: NS_XHTML}
            var richMessage = ltx.parse(request.content)
            plainMessage    = request.content.replace(/(<([^>]+)>)/ig, '')
        } catch (e) {
            return caller._clientError('Can not parse XHTML message', request)
        }
    }
    var stanza = new builder.Element(
        'message',
        { to: data.to, type: data.type }
    ).c('body').t(plainMessage).up()
    if (richMessage)
        stanza.c('html', {xmlns: NS_XHTML_IM})
            .c('body', attrs)
            .t(richMessage)
    caller.client.send(stanza)
}

module.exports = buildStanza