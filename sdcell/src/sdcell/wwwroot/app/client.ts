class cellClient {
    cells = new Array<cellItem>();
    me = new cellItem();
    cellHub: SignalR.Hub.Proxy;
    ready = false;

    constructor() {
        var connection = $.hubConnection();
        this.cellHub = connection.createHubProxy('cellHub');
        this.cellHub.on('pushCell', i => this.hubPushCell(i));
        this.cellHub.on('deleteCell', i => this.hubDeleteCell(i));
        //connection.logging = true;
        connection.start().then(() => {
            //return this.hubClear();
        }).then(() => {
            return this.hubAll();
        }).then(() => {
            this.ready = true;
            return this.hubCreateNew();
        });
    }

    private hubPushCell(item: serverCellItem) {
        this.updateOrCreate(item);
    }

    private hubDeleteCell(id: string) {
        console.log(id);
        for (var i = 0; i < this.cells.length; ++i) {
            if (this.cells[i].id == id) {
                this.cells.splice(i, 1);
                break;
            }
        }
    }

    private hubMoveTo(id, position: { X: number, Y: number }) {
        return this.cellHub.invoke('MoveTo', id, position);
    };

    private hubClear() {
        return this.cellHub.invoke('Clear');
    }

    private hubAll() {
        return this.cellHub.invoke('all').then(all => {
            this.cells.splice(0, this.cells.length);
            for (var i of all) {
                this.cells.push(cellItem.fromServer(i));
            }
        });
    }

    private hubCreateNew() {
        return this.cellHub.invoke('new').then(i => {
            this.me = cellItem.fromServer(i);
        });
    }

    moveTo(px: number, py: number) {
        if (this.ready) {
            return this.hubMoveTo(this.me.id, { X: px, Y: py });
        }
    }

    updateOrCreate(serverItem: serverCellItem) {
        var find = false;
        var item = cellItem.fromServer(serverItem);
        for (var i of this.cells) {
            if (i.id == serverItem.Id) {
                find = true;
                i.fromServer(serverItem);
                break;
            }
        }
        if (!find) {
            this.cells.push(item);
        }
        if (this.me && item.id == this.me.id) {
            this.me.fromServer(serverItem);
        }
    }
}

class cellItem {
    id: string;
    r: number;
    px: number;
    py: number;

    fromServer(item: serverCellItem) {
        this.id = item.Id;
        this.r = item.R;
        this.px = item.Position.X;
        this.py = item.Position.Y;
    }

    static fromServer(item: serverCellItem) {
        var i = new cellItem();
        i.id = item.Id;
        i.r = item.R;
        i.px = item.Position.X;
        i.py = item.Position.Y;
        return i;
    }
}

class serverCellItem {
    Id: string;
    R: number;
    Position: {
        X: number,
        Y: number;
    }
}