import * as u from '../../../shared/api_client/utils';
import * as r from '../../../shared/api_client/requests';

function changer() {
    console.log("On change le langue.");
    localStorage.setItem("lang", (document.getElementById("lang") as HTMLInputElement).value);
    location.reload();
}

async function update() {
	var req: XMLHttpRequest = new (r.request as any)("GET", u.WEBSITE_WEBPATH+"/langs/" + localStorage.getItem("lang") + ".lang", {}, true);
        var trad_table: Object = await r.receive_blocking(req);
	var page: string = document.documentElement.innerHTML;
	for (const [key, value] of Object.entries(trad_table)) {
		page = page.replaceAll("[[[[" + key + "]]]]", u.upper(value));
		page = page.replaceAll("[[[" + key + "]]]", u.capitalize(value));
		page = page.replaceAll("[[" + key + "]]", u.lower(value));
	}
	document.documentElement.innerHTML = page;
	(document.getElementById('lang') as HTMLInputElement).value = localStorage.getItem("lang") as string // TODO check if local is null
}

var langs = ["fr", "en", "de"];
if (localStorage.getItem("lang") === null) {
    console.log(localStorage.getItem("lang"));
    console.log("Langue non défninie. Je met l'Anglais.")
    localStorage.setItem("lang", "en");
}
(async () => {
    await update();
    document.getElementById("lang")?.addEventListener("change", changer);
})();
