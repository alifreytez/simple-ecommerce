function TemplateQuery() {}

TemplateQuery.templatePath = "templates.html";
TemplateQuery.loadFile = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await window.fetch(TemplateQuery.templatePath),
                text = await res.text();

            if (!res.ok) throw {status: res.status, statusText: res.statusText};
            
            resolve(text);
        } catch (error) {
            console.log(`Error <${error.status}>: ${error.statusText || "desconocido"}`);
        }
    });
}
TemplateQuery.get = async function() {
    const allTmplText = await TemplateQuery.loadFile(),
        allTmplHTML = new DOMParser().parseFromString(allTmplText, "text/html");

    return allTmplHTML;
}

export default TemplateQuery.get();