const sightsCards = document.querySelector(".sights_card");

const createSightCard = (data) => {
	console.log(data);
	const { name, description, photoUrl } = data
	const div = document.createElement("div");
	const h3 = document.createElement("h3");
	const p = document.createElement("p");
	const img = document.createElement("img");
	const div_img = document.createElement("div");

	h3.textContent = name;
	p.textContent = description;
	img.src = photoUrl;
	img.alt = 'sight photo';
	div_img.append(img);

	div.classList.add('sight_box');
	div_img.classList.add('sight_box_img_box');

	div.append(h3, div_img, p);
	return div;
};

const getSights = async () => {
	try {
		const res = await fetch('https://rs882.github.io/rp_fapi/data.json');
		const data = await res.json();
		return data;
	} catch (e) { throw e }

}

getSights().then(res => {
	const dataNode = res.attractions.map(e => createSightCard(e))

	sightsCards.append(...dataNode)
})
	.catch(error => "Something went wrong :" + error);