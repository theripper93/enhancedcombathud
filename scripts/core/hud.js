import { DrawerButton } from "./components/drawer/drawerButton";
import { DrawerPanel } from "./components/drawer/drawerPanel";
import { AccordionPanel } from "./components/main/buttonPanel/accordionPanel";
import { AccordionPanelCategory } from "./components/main/buttonPanel/accordionPanelCategory";
import { ButtonPanel } from "./components/main/buttonPanel/buttonPanel";
import { ActionButton } from "./components/main/buttons/ActionButton";
import { ButtonPanelButton } from "./components/main/buttons/buttonPanelButton";
import { ItemButton } from "./components/main/buttons/itemButton";
import { SplitButton } from "./components/main/buttons/splitButton";
import {ActionPanel} from "./components/main/actionPanel";
import { PortraitPanel } from "./components/portrait/portraitPanel";


export class CoreHUD extends Application{
  constructor () {
    super();
  }

  static get ARGON() {
    return {
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