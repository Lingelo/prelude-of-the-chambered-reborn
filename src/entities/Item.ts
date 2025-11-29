export class Item {
  icon: number;
  color: number;
  name: string;
  description: string;

  constructor(icon: number, color: number, name: string, description: string) {
    this.icon = icon;
    this.color = color;
    this.name = name;
    this.description = description;
  }

  static readonly none = new Item(-1, 0xffc363, "", "");
  static readonly powerGlove = new Item(0, 0xffc363, "Power Glove", "Smaaaash!!");
  static readonly pistol = new Item(1, 0xeaeaea, "Pistol", "Pew, pew, pew!");
  static readonly flippers = new Item(2, 0x7cbbff, "Flippers", "Splish splash!");
  static readonly cutters = new Item(3, 0xcccccc, "Cutters", "Snip, snip!");
  static readonly skates = new Item(4, 0xae70ff, "Skates", "Sharp!");
  static readonly key = new Item(5, 0xff4040, "Key", "How did you get this?");
  static readonly potion = new Item(6, 0x4aff47, "Potion", "Healthy!");
}
