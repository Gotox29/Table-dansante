class TableClass {
    static MUL = 0;
    static SOU = 1;
    static DIV = 2;
    static ADD = 3;
    static getStep(modulo, opp = TableClass.MUL) {
        switch(opp) {
            case TableClass.SOU :
                return 2.0 * Math.PI / modulo;
            case TableClass.DIV :
                return 2.0 * Math.PI / modulo;
            case TableClass.ADD :
                return 2.0 * Math.PI / modulo;
            case TableClass.MUL :
            default :
                return 2.0 * Math.PI / modulo;
        }
    }
    static result(index, modulo, table, opp = TableClass.MUL) {
        switch(opp) {
            case TableClass.SOU :
                return index - table % modulo;
            case TableClass.DIV :
                return index / table % modulo;
            case TableClass.ADD :
                return index + table % modulo;
            case TableClass.MUL :
            default :
                return index * table % modulo;
        }
    }
    static setMethode(methode) {
        switch(methode) {
            case 'soustraction' :
                return TableClass.SOU;
            case 'division' :
                return TableClass.DIV;
            case 'addition' :
                return TableClass.ADD;
            case 'multiplication' :
            default :
                return TableClass.MUL;
        }
    }
}

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    set x(val) {
        this._x = val;
    }
    set y(val) {
        this._y = val;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
}

class Color {
    constructor() {
        this.inputColor = document.getElementById('couleur');
        this.inputAleatoire = document.getElementById('couleur-aleatoire');
        this.inputProgress = document.getElementById('couleur-progressive');
        this.inputCrayon = document.getElementById('couleur-crayon');
        this.setColor();
    }
    static test = 0;
    setColor() {
        this.color = this.inputColor.value;
        if(this.inputAleatoire.checked) {
            this.crayon = false;
            this.aleatoire = true;
            this.progressif = false;
        } else if (this.inputProgress.checked){
            this.crayon = false;
            this.aleatoire = false;
            this.progressif = true;
        } else if(this.inputCrayon.checked) {
            this.crayon = true;
            this.aleatoire = false;
            this.progressif = false;
        } else {
            this.crayon = false;
            this.aleatoire = false;
            this.progressif = false;
        }
    }
    getColorCrayon(start) {
        start = typeof start === 'undefined' ? 0 : start;
        return `rgb(${start % 255}, ${start % 255}, ${start % 255})`;

    }
    getColorProgressive(start, end) {
        let a = start;
        let b = end;
        let c = a - b;
        c = c < 0 ? 0 - c : c;
        return `rgb(${a % 255}, ${b % 255}, ${c% 255})`;
    }
    getColorAleatoire() {
        return '#'+Math.random().toString(16).slice(-6);
    }
    getColor(start, end) {
         if (this.progressif && typeof start !== 'undefined') {
            return this.getColorProgressive(start, end);
        } else if (this.crayon) {
            return this.getColorCrayon(start);
        } else if(this.aleatoire || this.progressif && typeof start === 'undefined') {
            return this.getColorAleatoire();
        } else {
            return this.color;
        }
    }
}
class CanvasDansingTable {
    constructor(canvas, modulo, multiplicateur, methode) {
        this.ctx = canvas.getContext("2d");
        this.centre = new Point(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
        let margin = 10;
        this.rayon = this.centre.x-margin;
        this.color = new Color();
        this.draw(modulo, multiplicateur, methode);

    }
    draw(modulo = this.modulo, multiplicateur = this.multiplicateur, methode = this.methode) {
        this.clear();
        this.color.setColor();
        if(modulo !== this.modulo || multiplicateur !== this.multiplicateur) {
            this.points = [];
            if(methode !== this.methode) {
                this.methode = methode;
            }
            if(modulo !== this.modulo) {
                this.modulo = modulo;
                this.step = TableClass.getStep(this.modulo, this.methode);
            }
            if(multiplicateur !== this.multiplicateur) {
                this.multiplicateur = multiplicateur;
            }
            this.drawCircle();
        } else {
            this.points = [];
            this.drawCircle();
        }
    }
    drawCircle() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color.getColor();
        this.ctx.arc(this.centre.x, this.centre.y, this.rayon, 0, Math.PI*2, true);
        this.ctx.stroke();
        this.ctx.closePath();
        this.drawPoints();
    }
    positionX(arrive) {
        return this.centre.x + this.rayon * Math.cos(arrive * this.step-Math.PI/2);
    }
    positionY(arrive) {
        return this.centre.y + this.rayon * Math.sin(arrive * this.step-Math.PI/2);
    }
    drawPoints() {
        for(let i = 0; i < this.modulo; i++) {
            let point = new Point(this.positionX(i), this.positionY(i));
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.color.getColor(point.x, point.y);
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
            this.ctx.stroke();
            this.ctx.closePath();
            this.points.push(point);
        }
        this.drawLine();
    }
    drawLine() {
        this.points.map((point, index) => {
            this.ctx.beginPath();
            this.ctx.moveTo(point.x, point.y);
            let arrive = TableClass.result(index, this.modulo, this.multiplicateur, this.methode);
            let p2 = this.points.find((p) => p.x === this.positionX(arrive) && p.y == this.positionY(arrive));
            let point2;
            if(typeof p2 !== 'undefined') {
                point2 = p2;
            } else {
                point2 = new Point(this.positionX(arrive), this.positionY(arrive));
            }
            // console.log(this.positionX(arrive));
            // console.log(this.positionY(arrive));
            // console.log(this.positionX(arrive), point2.x);
            // console.log(this.positionY(arrive), point2.y);
            // console.log(p2);
            this.ctx.lineTo(point2.x, point2.y);
            this.ctx.strokeStyle = this.color.getColor(index, this.points.indexOf(point2));
            this.ctx.stroke();
            this.ctx.closePath();
        });
    }
    clear() {
        this.ctx.beginPath();
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        this.ctx.closePath();
    }
}

class Control {
    constructor() {
        this.vitesse = 200;
        this.affNb = document.getElementById('affNb');
        this.affTable = document.getElementById('affTable');
        this.afficheur = document.getElementById('afficheur');
        this.changer = document.getElementById('changer');
        this.pasMultiplicateur = document.getElementById('incremente-multiplicateur');
        this.checkboxModulo = document.getElementById('incremente-modulo');
        this.checkboxModuloSous = document.getElementById('decremente-modulo');
        this.methodeListe = document.getElementById('methode');
        this.etat = false;
        this._id = Control.id++;
    }
    static id = 0
    static session = 0;
    check() {
        this.incrementeMultiplicateur = this.pasMultiplicateur.value;
        this.incrementeModulo = this.checkboxModulo.checked;
        this.decrementeModulo = this.checkboxModuloSous.checked;
        this.methode = TableClass.setMethode(this.methodeListe.value);
    }
    start() {
        if(typeof this.interval !== 'undefined') this.stop();
        this.check();
        this.etat = true;
        this.collapse(this.etat);
        let session = ++Control.session;
        this.moduloActuel = parseFloat(this.moduloDepart);
        this.interval = setInterval(this.loop.bind(this), this.vitesse, session);
    }
    loop(session) {
        this.collapse(true);
        if(this.etat) console.info("id",session);
        if(typeof this.contenant === 'undefined') {
            this.contenant = new CanvasDansingTable(canvas, this.moduloActuel, this.multiplicateur, this.methode);
        } else {
            this.contenant.draw(this.moduloActuel, this.multiplicateur, this.methode);
        }
        this.update();
    }
    restart() {
        if(typeof this.contenant !== 'undefined') {
            let session = Control.session;
            if(typeof this.interval !== 'undefined') this.stop();
            this.check();
            this.etat = true;
            this.collapse(this.etat);
            this.interval = setInterval(this.loop.bind(this), this.vitesse, session);
        }
    }
    update(moduloDepart = this.moduloDepart, multiplicateur = this.multiplicateur, vitesse = this.vitesse) {
        if(this.moduloDepart !== moduloDepart) {
            this.moduloDepart = moduloDepart;
            this.moduloActuel = moduloDepart;
        }
        if(this.multiplicateur !== multiplicateur) {
            this.multiplicateur = multiplicateur;
        }
        if(this.vitesse !== vitesse) {
            this.vitesse = vitesse;
        }
        this.setAffTable();
        this.setAffNb();
        if(this.incrementeMultiplicateur && this.etat) {
            this.multiplicateur = ((this.multiplicateur * 100 + this.incrementeMultiplicateur * 100) / 100).toFixed(2);
        }
        if(this.incrementeModulo && this.etat) {
            this.moduloActuel++;
            //parseFloat(this.moduloActuel + 0.01).toFixed(2);
        } else if(this.decrementeModulo && this.etat) {
            this.moduloActuel--;
        }
    }
    setAffTable(multiplicateur = this.multiplicateur) {
        this.affTable.innerHTML = multiplicateur;
    }
    setAffNb(modulo = this.moduloActuel) {
        this.affNb.innerHTML = modulo;
    }
    stop() {
        this.etat = false;
        clearInterval(this.interval);
        this.check();
    }
    collapse(etat) {
            if(this.changer.className.includes('collapse') || this.etat) {
                if(this.etat)
                    this.changer.classList.remove('collapse')
            } else {
                    this.changer.classList.add('collapse')
            }
            if(this.afficheur.className.includes('collapse') || etat) {
                if(etat)
                    this.afficheur.classList.remove('collapse')
            } else {
                    this.afficheur.classList.add('collapse')
            }
    }
    clear() {
        this.stop();
        if(typeof this.contenant !== "undefined") {
            this.contenant.clear();
        }
        this.setAffNb(0);
        this.setAffTable(0);
        this.collapse();
    }
    prec() {
        if(typeof this.contenant !== 'undefined') {
            if(typeof this.interval !== 'undefined') this.stop();
            this.collapse(true);
            this.contenant.draw(this.incrementeModulo ? --this.moduloActuel : this.decrementeModulo ? ++this.moduloActuel: this.moduloActuel, 
                this.incrementeMultiplicateur ? --this.multiplicateur : this.decrementeMultiplicateur ? ++this.multiplicateur : this.multiplicateur);
            this.setAffTable();
            this.setAffNb();
        }
    }
    suiv() {
        if(typeof this.contenant !== 'undefined') {
            if(typeof this.interval !== 'undefined') this.stop();
            this.collapse(true);
            this.contenant.draw(this.incrementeModulo ? ++this.moduloActuel : this.decrementeModulo ? --this.moduloActuel : this.moduloActuel, 
                this.incrementeMultiplicateur ? ++this.multiplicateur : this.decrementeMultiplicateur ? --this.multiplicateur : this.multiplicateur);
            this.setAffTable();
            this.setAffNb();
        }
    }
    setVitesse(vitesse) {
        this.vitesse = vitesse;
        if(this.etat) this.restart();
    }
}

class Instant {
    constructor(id) {
        this.id = id;
    }
    set multiplicateur(val) {
        this._multiplicateur = val;
    }
    get multiplicateur() {
        return this._multiplicateur;
    }
    set modulo(val) {
        this._modulo = val;
    }
    get modulo() {
        return this._modulo;
    }
}

class Memoires {
    constructor(control) {
        this.control = control;
        this.instants = [];
    }
    static id = 0;
    add(multiplicateur, modulo) {
        if(!this.existe(modulo, multiplicateur)) {
            let instant = new Instant(Memoires.id++);
            let { liste } = getInputs();
            instant.multiplicateur = multiplicateur;
            instant.modulo = modulo;
            this.instants.push(instant);
            let li = document.createElement('li');
            let texte = document.createTextNode(`Table ${instant.multiplicateur} modulo ${instant.modulo}.`);
            li.setAttribute('id',instant.id);
            li.classList.add('item');
            li.appendChild(texte);
            let drop = document.createElement('div');
            drop.classList.add('drop');
        
            let buttonV = document.createElement('button');
            buttonV.addEventListener('click', loadInstant(instant.id));
            buttonV.classList.add('revoir')
            let buttonVTexte = document.createTextNode('Aller');
            buttonV.appendChild(buttonVTexte);
            drop.appendChild(buttonV);
        
            let buttonD = document.createElement('button');
            buttonD.addEventListener('click', deleteInstant(instant.id, li));
            buttonD.classList.add('remove');
            let buttonDTexte = document.createTextNode('Supprimer');
            buttonD.appendChild(buttonDTexte);
            drop.appendChild(buttonD);
        
            li.appendChild(drop);
            liste.appendChild(li);
            return instant;
        }
        return false;
    }
    save() {
        return this.add(this.control.affTable.innerHTML, this.control.affNb.innerHTML);
    }
    load(id) {
        let instant = this.instants.find((instant) => instant.id === parseInt(id));
        if(instant) {
            let { vitesse } = getInputs();
            document.getElementById('multiplicateur').value = instant.multiplicateur;
            document.getElementById('moduloDepart').value = instant.modulo;
            this.control.update(instant.modulo, instant.multiplicateur, vitesse);
            this.control.loop(id);
        }
    }
    delete(id) {
        this.instants = this.instants.filter((instant) => instant.id !== id);
    }
    existe(nb, mult) {
        return this.instants.find((instant) => instant.modulo === nb && instant.multiplicateur === mult ? true : false)
    }
}



function checkboxAlterne(defaut,...cibles) {
    return function() {
        cibles.forEach((cible) => {
            cible = document.getElementById(cible);
            if(cible.checked) {
                cible.checked = false;
            }
        });
        if(defaut && !this.checked) {
            document.getElementById(defaut).checked = true;
        }
    }
}
document.getElementById('checkbox-couleur').addEventListener('click',checkboxAlterne('checkbox-couleur', 'couleur-aleatoire', 'couleur-progressive', 'couleur-crayon'));
document.getElementById('couleur-aleatoire').addEventListener('click',checkboxAlterne('checkbox-couleur', 'checkbox-couleur', 'couleur-progressive', 'couleur-crayon'));
document.getElementById('couleur-progressive').addEventListener('click',checkboxAlterne('checkbox-couleur', 'checkbox-couleur', 'couleur-aleatoire', 'couleur-crayon'));
document.getElementById('couleur-crayon').addEventListener('click',checkboxAlterne('checkbox-couleur', 'checkbox-couleur', 'couleur-aleatoire', 'couleur-progressive'));

// document.getElementById('incremente-multiplicateur').addEventListener('click', checkboxAlterne(false, 'decremente-multiplicateur'));
// document.getElementById('decremente-multiplicateur').addEventListener('click', checkboxAlterne(false, 'incremente-multiplicateur'));
document.getElementById('incremente-modulo').addEventListener('click', checkboxAlterne(false, 'decremente-modulo'));
document.getElementById('decremente-modulo').addEventListener('click', checkboxAlterne(false, 'incremente-modulo'));

const control = new Control();
const memoire = new Memoires(control);


memoire.add(2555,1571);
memoire.add(993,354);
memoire.add(628,778);
memoire.add(113,263);
memoire.add(1104,389);
memoire.add(1003,5010);
memoire.add(1056,5067);


let interval;
function off() {
    if(typeof interval !== 'undefined') clearInterval(interval);
    control.stop();
}
function getInputs() {
    return {
        multiplicateur : document.getElementById('multiplicateur').value,
        moduloDepart : document.getElementById('moduloDepart').value,
        vitesse : document.getElementById('vitesse').value,
        liste : document.getElementById('liste'),
    };
}

document.getElementById('start').addEventListener('click',() => {
    let { moduloDepart, vitesse, multiplicateur } = getInputs();
    if(typeof interval !== 'undefined') clearInterval(interval);
    control.update(moduloDepart, multiplicateur, vitesse);
    control.start();
});
document.getElementById('stop').addEventListener('click',() => {
    control.stop();
    off();
});
document.getElementById('prec').addEventListener('click',() => {
    control.prec();
    off();
});
document.getElementById('suiv').addEventListener('click',() => {
    control.suiv();
    off();
});
document.getElementById('restart').addEventListener('click',() => {
    off();
    control.restart();
});
document.getElementById('changer').addEventListener('click',() => {
    let { vitesse, methode } = getInputs();
    control.setVitesse(vitesse);
})
document.getElementById('clear').addEventListener('click',() => {
    off();
    control.clear();
});
function deleteInstant(id, li) {
    return function e() {
        off();
        memoire.delete(id);
        li.remove();
    }
}
function loadInstant(id) {
    // control.collapse();
    return function e(){
        off();
        memoire.load(id);
    } 
}
for (const button of document.querySelectorAll('#liste>li .revoir')) {
    let li = button.parentElement.parentElement;
    let id = li.getAttribute('id')
    button.addEventListener('click', loadInstant(id));
}
for (const button of document.querySelectorAll('#liste>li .remove')) {
    let li = button.parentElement.parentElement;
    let id = li.getAttribute('id')
    button.addEventListener('click', deleteInstant(id, li));
}
document.getElementById('save').addEventListener('click',() => {
    if((control.affNb.innerHTML > 0 || control.affTable.innerHTML> 0)) {
        memoire.save();
    }
});
document.getElementById('delAll').addEventListener('click', () => {
    for (const button of document.querySelectorAll('#liste>li .remove')) {
        button.click();
    }
    off();
});
document.getElementById('getAll').addEventListener('click', () => {
    off();
    let {vitesse} = getInputs();
    let repetition = document.getElementById('repetition').checked
    const buttons  = document.querySelectorAll('#liste>li .revoir');
    if(buttons.length > 0) {
        let current = 0;
        interval = setInterval(() => {
            if(buttons.length >= current + 1) {
                control.collapse(true);
                let id = buttons[current++].parentElement.parentElement.getAttribute('id');
                // console.log(buttons[current++].parentElement.parentElement.getAttribute('id'));
                memoire.load(id);
            } else {
                if(repetition) {
                    current = 0;
                    let id = buttons[current++].parentElement.parentElement.getAttribute('id');
                    memoire.load(id);    
                } else {
                    clearInterval(interval);
                }
            }
        }, vitesse);
    }
});
