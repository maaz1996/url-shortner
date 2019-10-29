module.exports = () => {
    const config = require('../config/index')
    const shortid = require('shortid')
    const validurl = require('valid-url')
    const Url = require('../model/urlmodel')
    const urlservices = ({ payload }) => {
        return new Promise(async (resolve, reject) => {
            try {

                const longurl = payload.longurl
                const baseurl = config['BaseUrl']
                const urlcode = shortid.generate();
                // console.log(baseurl)
                if (!validurl.isUri(baseurl)) {
                    resolve("not valid url")
                }
                if (validurl.isUri(longurl)) {
                    try {
                        let URL = await Url.findOne({ longurl })
                        if (URL) {
                            resolve(URL)
                        }
                        else {
                            const shorturl = baseurl + '/' + urlcode
                            const urlinfo = new Url({
                                longurl,
                                shorturl,
                                urlcode,
                                date: new Date()

                            })
                            const response = await urlinfo.save()
                            resolve(response)
                        }

                    } catch (error) {
                        reject(error)
                    }
                }
                else {
                    resolve("invalid long url")
                }
            }
            catch (error) {
                reject(error)
            }

        })
    }
    return {
        urlservices
    }
};