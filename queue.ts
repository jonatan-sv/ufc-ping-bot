export default class Queue {
  items: string[];

  constructor() {
    this.items = [];
  }

  add(element: string) {
    this.items.push(element.toLowerCase());
  }

  advance() {
    return this.isEmpty() 
      ? "A fila está vazia" 
      : this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  next() {
    return this.isEmpty()
      ? "A fila está vazia"
      : this.items[2].split("")[0].toUpperCase() + this.items[2].slice(1);
  }

  clear() {
    this.items = [];
    return "Fila limpa com sucesso";
  }

  moveToEnd(element: string) {
    const nameToLowerCase = element.toLowerCase();
    const index = this.items.indexOf(nameToLowerCase);

    if (index > -1) {
      this.items.splice(index, 1); // Remove from current position
      this.items.push(nameToLowerCase); // Re-add to the end
    } else {
      return "Esta pessoa não foi encontrada na fila";
    }
  }

  remove(element: string): string {
    const nameToLowerCase = element.toLowerCase();
    const index = this.items.indexOf(nameToLowerCase);

    if (index > -1) {
      this.items.splice(index, 1);
      return "Sucesso";
    } else {
      return "Esta pessoa não foi encontrada na fila";
    }
  }

  insert(element: string, position: number): string {
    const nameToLowerCase = element.toLowerCase();
    const queuePosition = position + 1;

    if (position >= 0 && position <= this.items.length) {
      this.items.splice(queuePosition, 0, nameToLowerCase);
      return `${this.items[queuePosition]} furou a fila!`;
    } else {
      return "Posição inválida!";
    }
  }

  show(): string[]{
    return this.items;
  }

  listAll(): string {
    const players = this.items.map(
      (item) => item.split("")[0].toUpperCase() + item.slice(1)
    );

    if (this.isEmpty()) {
      return "A fila está vazia.";
    } else {
      const string = `🏓 *${players[0]}* e *${players[1]}* estão jogando! 🏓`;
      const remaining = players.slice(2);
      const finalString =
        `${string}\nFila:\n` +
        remaining.map((player, index) => `*${index + 1}.* ${player}`).join("\n");

      return finalString;
    }
  }
}
