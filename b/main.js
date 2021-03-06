var templateNode = document.createElement('tr');

function createTemplate() {
	var td1 = templateNode.appendChild(document.createElement('td'));
	var td2 = templateNode.appendChild(document.createElement('td'));
	td1.classList.add('photo-cell');
	td2.classList.add('info-cell');
	var href = document.createElement('a');
	href.appendChild(document.createElement('img'));
	td1.appendChild(href);
}

function showPreview(src) {
	var preview = document.getElementById('preview');
	preview.firstElementChild.src = src;
	preview.classList.add('show-preview');
	preview.addEventListener('click', () => {
		preview.classList.remove('show-preview');
	});
	preview.firstElementChild.addEventListener('mouseleave', () => {
		preview.classList.remove('show-preview');
	});
}

function addRow(photoUrls, data) {
	var newRow = templateNode.cloneNode(true);
	var tds = newRow.querySelectorAll('td');
	tds[0].childNodes[0].href = photoUrls.source;
	tds[0].childNodes[0].setAttribute('target', '_blank');
	tds[0].childNodes[0].childNodes[0].src = photoUrls.preview;
	tds[1].appendChild(document.createElement('a'));
	tds[1].appendChild(document.createElement('p'));
	tds[1].childNodes[0].setAttribute('target', '_blank');
	tds[1].childNodes[1].textContent = data.text;
	tds[1].childNodes[0].href = tds[1].childNodes[0].innerText = formatInfoToHTML(data);


	document.getElementById('tblBody').appendChild(newRow);

	var timeout = null;
	newRow.addEventListener('mouseover', (e) => {
		if (e.target.tagName === 'IMG') {
			timeout = setTimeout(function () {
				showPreview(photoUrls.source);
			}, 500);
		}
	});

	newRow.addEventListener('mouseleave', (e) => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	});
}

function formatInfoToHTML(data) {
	return data.id ? `http://vk.com/id${data.id}` : '';
	//TODO:
}

function getRecords(groupId, count) {
	return new Promise((resolve) => {
		VK.Api.call('wall.get', {
			'owner_id': `${Number(groupId) ? -groupId : ''}`,
			'domain': `${Number(groupId) ? '' : groupId}`,
			count: count
		}, resolve);
	});
}




window.addEventListener('load', () => {
	createTemplate();
	//   addRow({source: 'https://pp.vk.me/c633523/v633523335/19d35/_jOH1ihVksw.jpg', preview: 'https://pp.vk.me/c633523/v633523335/19d3f/XviG7LRj9kc.jpg'});
	// document.getElementById('getBelRecords').addEventListener('click', (e) => {
	// });
	document.getElementById('getRecords').addEventListener('click', (e) => {
		var groupId = document.getElementById('groupId').value;

		getRecords(groupId, 50).then((data) => {
			// console.log(data);
			if (data.response) {
				var posts = data.response;
				document.getElementById('tblBody').innerHTML = '';
				posts.forEach((item) => {
					if (typeof item === 'number' || !item.attachment || !item.attachment.photo) {
						return;
					}
					let urls = {
						source: item.attachment.photo.src_xxbig || item.attachment.photo.src_xbig || item.attachment.photo.src_big,
						preview: item.attachment.photo.src
					};
					addRow(urls, {
						id: item.signer_id,
						text: item.text ? item.text : ''
					});
				});
			}
		});
	});
});