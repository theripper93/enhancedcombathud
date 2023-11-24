import { DrawerButton } from "./components/drawer/drawerButton.js";
import { DrawerPanel } from "./components/drawer/drawerPanel.js";
import { AccordionPanel } from "./components/main/buttonPanel/accordionPanel.js";
import { AccordionPanelCategory } from "./components/main/buttonPanel/accordionPanelCategory.js";
import { ButtonPanel } from "./components/main/buttonPanel/buttonPanel.js";
import { ActionButton } from "./components/main/buttons/ActionButton.js";
import { ButtonPanelButton } from "./components/main/buttons/buttonPanelButton.js";
import { ItemButton } from "./components/main/buttons/itemButton.js";
import { SplitButton } from "./components/main/buttons/splitButton.js";
import {ActionPanel} from "./components/main/actionPanel.js";
import {PortraitPanel} from "./components/portrait/portraitPanel.js";
import {ArgonTooltip} from "./tooltip.js";
import { ArgonComponent } from "./components/component.js";


export class CoreHUD extends Application{
  constructor () {
    super();
  }

  static get ARGON() {
    return {
      CORE: {
        CoreHUD: CoreHUD,
        ArgonTooltip: ArgonTooltip,
        ArgonComponent: ArgonComponent,
      },
      MAIN: {
        BUTTONS: {
          ActionButton: ActionButton,
          ButtonPanelButton: ButtonPanelButton,
          ItemButton: ItemButton,
          SplitButton: SplitButton,
        },
        ActionPanel: ActionPanel,
        BUTTON_PANELS: {
          ButtonPanel: ButtonPanel,
          ACCORDION: {
            AccordionPanel: AccordionPanel,
            AccordionPanelCategory: AccordionPanelCategory,
          }
        }
      },
      PORTRAIT: {
        PortraitPanel: PortraitPanel,
      },
      DRAWER: {
        DrawerButton: DrawerButton,
        DrawerPanel: DrawerPanel,
      },
    }
  }
}