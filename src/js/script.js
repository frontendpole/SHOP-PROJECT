class Shop {
    constructor() {
        this.url = 'http://localhost:3000/db/sklep_test';
        this.table = document.querySelector('#user-table > tbody');
        const sendButton = document.querySelector('#save-item-button');
        sendButton.addEventListener('click',this.submitItemData.bind(this));
        this.modal = document.querySelector('.modal');
        this.cancelButton = document.querySelector('#cancel');
        this.cancelButton.addEventListener('click', this.close.bind(this));
        this.backgroundModal = document.createElement('div');
        this.backgroundModal.classList.add('modal-background');
        document.body.appendChild(this.backgroundModal);
        this.backgroundModal.addEventListener('click', this.close.bind(this));
        const addProductButton = document.querySelector('#add-product-button');
        addProductButton.addEventListener('click', this.openModal.bind(this));
    }

    async getShopData() {
        const items = await this.getData();
        this.clearTableBody();
        items.forEach((item) => {
            const row = this.createRow(item);
            this.table.appendChild(row);
        });
    }

    getData = () => fetch(this.url).then(response => response.json());

    createCell(value) {
        const td = document.createElement('td');
        td.innerText = value;
        return td;
    }

    clearTableBody() {
        this.table.innerHTML = '';
    }

    createRow(item) {
        const tr = document.createElement('tr');
        ['name', 'price', 'count'].forEach(key => {
            tr.appendChild(this.createCell(item.data[key]));
        });
        tr.appendChild(this.deleteButton(item._id));
        return tr;
    }
    deleteButton(id) {
        const button = document.createElement('button');
        button.classList.add('delete-button');
        button.innerText = 'Delete';
        button.dataset.itemId = id;
        button.addEventListener('click', this.removeItemHandler.bind(this));
        const cell = document.createElement('td');
        cell.appendChild(button);
        return cell;
    }

    removeItemHandler(event) {
        const id = event.target.dataset.itemId;
        const url = `${this.url}/${id}`;
        fetch(url, {method: 'DELETE'})
            .then(response => response.json())
            .then(()=>this.getShopData());
    }

    submitItemData(){
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const url = `${this.url}/${Date.now()}`;
        fetch(url,{method: 'POST', headers, body: JSON.stringify(this.getFormData())})
            .then(response => response.json())
            .then(()=> this.getShopData());
    }

    getFormData(){
        return{
            name: document.querySelector('#name').value,
            price: document.querySelector('#price').value,
            count: document.querySelector('#count').value
        }
    }

    openModal(){
        this.modal.classList.add('open');
        this.backgroundModal.classList.add('open');
    }

    close() {
        this.modal.classList.remove('open');
        this.backgroundModal.classList.remove('open');
    }
}

const shop = new Shop();
shop.getShopData();
