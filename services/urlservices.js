module.exports = () => {

    const urlservices = (payload) => {
        return new Promise(async (resolve, reject) => {
            try {
                resolve("url shortner service")
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