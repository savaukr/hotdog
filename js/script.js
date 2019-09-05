class AppHotdogs extends React.Component {
	constructor(props) {

		super(props);
		this.readList = this.readList.bind(this);
		this.addHotdog = this.addHotdog.bind(this);
		this.editHotdog = this.editHotdog.bind(this);
		this.deleteHotdog = this.deleteHotdog.bind(this);
		this.saveJson = this.saveJson.bind(this);
		this.vueHotdogs = this.vueHotdogs.bind(this);
		this.addHotdog = this.addHotdog.bind(this);
		this.addEditHotdog = this.addEditHotdog.bind(this);
		this.updateData = this.updateData.bind(this);
		this.state = {
			list: {},
			action: "list",
			checked: {},
			nowName: '',
			input: {}
		};
		this.readList();
	}

	saveJson() {
		//console.log('saveJson');
		if (this.state.input.name) {
			var newList = Object.assign({}, this.state.list);
			newList[this.state.input.name] = this.state.input;
			this.setState({ input: {} });
			this.setState({ list: newList });
			//this.setState((state) => {return {list: newList}});
		}
		var xhr = new XMLHttpRequest();
		let json;
		if (this.state.action === 'add') {
			json = JSON.stringify(newList);
			this.setState({ action: 'list' });
		} else json = JSON.stringify(this.state.list);

		xhr.open("POST", './php/saveJson.php', true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
				alert(xhr.status + ': ' + xhr.statusText);
			} else {
				console.log('ok');
			}
		};
		// Отсылаем объект в формате JSON и с Content-Type application/json
		// Сервер должен уметь такой Content-Type принимать и раскодировать
		xhr.send(json);
	}

	readList() {
		let setState = this.setState.bind(this);
		let hotdogsList;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', './hotdogs.json');
		xhr.send();
		xhr.onload = function () {
			if (xhr.status != 200) {
				// HTTP ошибка?
				// обработаем ошибку
				alert('Ошибка: ' + xhr.status);
				return;
			}
			hotdogsList = JSON.parse(xhr.response); // получим ответ из xhr.response
			let obj = {};
			for (let key in hotdogsList) {
				obj[key] = false;
			}
			setState({ checked: obj });
			setState({ list: hotdogsList });
		};
		xhr.onerror = function () {
			alert("Помилка при отриманні даних з сервера"); // обработаем ошибку, не связанную с HTTP (например, нет соединения)
		};
	}

	vueHotdogs() {
		this.setState({ action: "list" });
	}
	addHotdog() {
		this.setState({ action: "add" });
	}
	addEditHotdog(event) {
		let input = Object.assign({}, this.state.input);
		input[event.target.name] = event.target.value;
		this.setState({ input: input });
	}
	editHotdog() {
		if (this.state.nowName !== '') {
			this.setState({ action: "edit" });
			// verify
			this.setState({ input: this.state.list[this.state.nowName] });
		} else alert("Select hotdog, please!");
	}
	deleteHotdog() {
		let checked = this.state.checked;
		let list = Object.assign({}, this.state.list);
		for (let key in checked) {
			if (checked[key]) {
				delete list[key];
				delete checked[key];
				this.setState({ list: list });
			}
		}
	}

	updateData(event) {
		this.setState({ nowName: event.target.value });
		let obj = {};
		for (let key in this.state.checked) {
			obj[key] = false;
		}
		obj[event.target.value] = true;
		this.setState({ checked: obj });
	}

	render() {
		if (this.state.action == "list") {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'h1',
					null,
					'List of all existing hotdogs'
				),
				React.createElement(HotdogList, {
					list: this.state.list,
					check: this.state.checked,
					updateData: this.updateData
				}),
				React.createElement(
					'div',
					{ id: 'buttonWrap' },
					React.createElement(Button, {
						action: 'add hotdog',
						handler: this.addHotdog,
						id: 'add'
					}),
					React.createElement(Button, {
						action: 'edit hotdog',
						handler: this.editHotdog,
						id: 'edit'
					}),
					React.createElement(Button, {
						action: 'delete hotdog',
						handler: this.deleteHotdog,
						id: 'delete'
					}),
					React.createElement(Button, {
						action: 'save change',
						handler: this.saveJson,
						id: 'save'
					})
				)
			);
		} else if (this.state.action == "add") {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'h1',
					null,
					'Add new hotdog'
				),
				React.createElement(AddEdit, { addEditHotdog: this.addEditHotdog }),
				React.createElement(
					'div',
					{ id: 'buttonWrap' },
					React.createElement(Button, {
						action: 'list hotdog',
						handler: this.vueHotdogs
					}),
					React.createElement(Button, {
						action: 'edit hotdog',
						handler: this.editHotdog,
						id: 'edit'
					}),
					React.createElement(Button, {
						action: 'save change',
						handler: this.saveJson,
						id: 'save'
					})
				)
			);
		} else if (this.state.action == "edit") {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'h1',
					null,
					'Edit this hotdog'
				),
				React.createElement(AddEdit, {
					addEditHotdog: this.addEditHotdog,
					name: this.state.nowName,
					sausage: this.state.list[this.state.nowName].sausage,
					carrot: this.state.list[this.state.nowName].carrot,
					sauce: this.state.list[this.state.nowName].sauce,
					cabbage: this.state.list[this.state.nowName].cabbage
				}),
				React.createElement(
					'div',
					{ id: 'buttonWrap' },
					React.createElement(Button, {
						action: 'list hotdog',
						handler: this.vueHotdogs,
						id: 'list'
					}),
					React.createElement(Button, {
						action: 'add hotdog',
						handler: this.addHotdog,
						id: 'add'
					}),
					React.createElement(Button, {
						action: 'save change',
						handler: this.saveJson,
						id: 'save'
					})
				)
			);
		}
	}
}

class HotdogList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			'div',
			{ id: 'hotdogWrap' },
			Object.entries(this.props.list).map((value, index) => {
				return React.createElement(
					'div',
					{ key: index },
					React.createElement(
						'div',
						{ className: 'visualHotdog' },
						React.createElement('div', { className: 'bread' }),
						React.createElement('div', { className: 'carrot', style: { height: value[1].carrot * 5 } }),
						React.createElement('div', { className: 'sausage', style: { height: value[1].sausage * 5 } }),
						React.createElement('div', { className: 'cabbage', style: { height: value[1].cabbage * 5 } }),
						React.createElement('div', { className: 'bread' }),
						React.createElement(Hotdog, {
							name: value[0],
							check: this.props.check,
							updateData: this.props.updateData
						})
					)
				);
			})
		);
	}
}

class Hotdog extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return React.createElement(
			'div',
			{ className: 'kindHotdog' },
			React.createElement(
				'label',
				null,
				React.createElement('input', {
					type: 'radio',
					name: 'hotdog',
					value: this.props.name,
					checked: this.props.check[this.props.name] || false,
					onChange: this.props.updateData
				}),
				this.props.name
			)
		);
	}
}

class AddEdit extends React.Component {
	constructor(props) {
		super(props);
		this.handlChange = this.handlChange.bind(this);
		this.state = { hotdog: {
				name: this.props.name,
				sausage: this.props.sausage,
				carrot: this.props.carrot,
				sauce: this.props.sauce,
				cabbage: this.props.cabbag
			}
		};
	}

	handlChange(event) {
		let obj = Object.assign({}, this.state.hotdog);
		obj[event.target.name] = event.target.value;
		this.setState({ hotdog: obj });
		this.props.addEditHotdog(event);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'inputWrapper' },
			React.createElement(
				'div',
				{ className: 'addHotdog' },
				React.createElement(
					'label',
					null,
					'Name hotdog:',
					React.createElement('input', {
						type: 'text',
						name: 'name',
						value: this.state.name,
						placeholder: this.props.name,
						onChange: this.handlChange
					})
				)
			),
			React.createElement(
				'div',
				{ className: 'addHotdog' },
				React.createElement(
					'label',
					null,
					'how mutch sausage:',
					React.createElement('input', {
						type: 'number',
						name: 'sausage',
						value: this.state.sausage,
						placeholder: this.props.sausage,
						onChange: this.handlChange
					})
				)
			),
			React.createElement(
				'div',
				{ className: 'addHotdog' },
				React.createElement(
					'label',
					null,
					'how mutch carrot:',
					React.createElement('input', {
						type: 'number',
						name: 'carrot',
						value: this.state.carrot,
						placeholder: this.props.carrot,
						onChange: this.handlChange
					})
				)
			),
			React.createElement(
				'div',
				{ className: 'addHotdog' },
				React.createElement(
					'label',
					null,
					'how mutch sauce:',
					React.createElement('input', {
						type: 'number',
						name: 'sauce',
						value: this.state.sauce,
						placeholder: this.props.sauce,
						onChange: this.handlChange
					})
				)
			),
			React.createElement(
				'div',
				{ className: 'addHotdog' },
				React.createElement(
					'label',
					{ className: 'adHotdog' },
					'how mutch cabbage:',
					React.createElement('input', {
						type: 'number',
						name: 'cabbage',
						value: this.state.cabbage,
						placeholder: this.props.cabbage,
						onChange: this.handlChange
					})
				)
			)
		);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return React.createElement(
			'button',
			{
				id: this.props.id,
				type: 'submit',
				className: 'button',
				onClick: this.props.handler
			},
			this.props.action
		);
	}
}

ReactDOM.render(React.createElement(AppHotdogs, null), document.getElementById('content'));
