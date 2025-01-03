export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'de',
    messages: {
        // MARK: EN
        en: {
            info: {
                name: 'Group Gifts',
            },
            general: {
                you: 'You',
                name: 'Name',
                today: 'Today',
                yesterday: 'Yesterday',
                close: 'Close',
                and: 'and',
            },
            landing: {
                title: 'Christmas Gift Giving,<br>made easy',
                subtitle: 'Create a wishlist, set your budget and organize gifts in a group',
                createGroup: 'Create a Group',
                myGroups: 'My Groups',
                howItWorks: 'How it works',
                howItWorks1: '<b>Create a group</b> and invite everyone else',
                howItWorks2: 'Write your <b>wishlist</b> and set your <b>budget</b>',
                howItWorks3: '<b>Chat</b> about other person\'s wishes',
                howItWorks4: 'Everyone buys gifts for the person they were assigned to',
                tagline: 'Christmas Gift Giving, made easy',
                footerCopyright: 'Created by Filippo © {date}',
            },
            newGroup: {
                title: 'Create Group',
                groupName: 'Group Name',
                groupNamePlaceholder: 'Christmas {year}',
                hasMaxBudget: 'Maximum budget per person',
                maxBudgetDescription: 'Each person sets an individual budget for each other. ' +
                    'If this option is enabled, the individual budget is limited. The total budget per person is the sum of all budgets.',
                date: 'Date',
                members: 'Members',
                minimumMembers: 'A group needs at least {count} members',
                addMember: 'Add Member',
                error: 'Error creating group. Please try again.',
                createGroup: 'Create Group',
                creatingGroup: 'Creating Group...',
            },
            invite: {
                title: 'Invite your friends!',
                description: 'Copy this link and send it to your friends, so they can join the group.',
                copy: 'Copy Link',
                copied: 'Copied!',
                done: 'Done',
            },
            groups: {
                noGroupsYet: [
                    'No Groups',
                    {
                        title: 'Did you already join a group?',
                        content: 'To view a group you joined on another device, open the invite link again on this device.'
                    }
                ],
            },
            groupHome: {
                delete: {
                    title: 'Delete Group',
                    description: 'Are you sure you want to delete the group {0}? This action cannot be undone.',
                    cancel: 'Cancel',
                    confirm: 'Delete',
                },
                actions: {
                    balance: 'Balance',
                    invite: 'Invite Friends',
                    settings: 'Group Settings',
                    delete: 'Delete Group',
                    changeMember: 'Change Member',
                },
                tabs: {
                    home: 'Home',
                    wishlist: 'Your Wishlist',
                },
                memberNotJoined: '{0} has not joined the group yet|{0} have not joined the group yet',
                memberNoBudget: 'You need to set your budget for {0}',
                youAreResponsible: 'You are responsible',
                giftFor: 'Gift for {0}',
                giftForYou : 'Gift for you ({0})',
            },
            groupSettings: {
                title: 'Group Settings',
                description: 'Here you can edit the group\'s settings.',
                maxBudget: 'Maximum Budget',
                hasMaxBudget: 'Set maximum budget per person',
                save: 'Save',
                secretMode: 'Secret Mode',
                secretModeDescription: 'If enabled, members can only see who they are responsible for, but not who is responsible for other members.',
            },
            join: {
                error: 'Something went wrong. Please open the invite link again, or ask the person who invited you to send you a new invite link.',
                errorSorry: 'Sorry',
                title: 'Join Group',
                description: 'You have been invited to join the group {0}!',
                features: [
                    'Write your wishlist',
                    'Easily keep track of gifts for your friends and family',
                    'You only need to buy gifts for one person, with a shared budget'
                ],
                join: 'Join Group',
                selectYourName: 'Select your name',
            },
            memberHome: {
                title: 'Gift for {0}',
                tabs: {
                    gifts: 'Gifts',
                    chat: 'Chat',
                },
                whoIsResponsibleInfo: {
                    you: '{0} are responsible for buying gifts for {1}',
                    someoneElse: '{0} is responsible for buying gifts for {1}',
                },
                mustSetBudget: 'You haven\'t defined a budget for {0} yet.',
                budgetInfo: {
                    you: 'Enter your budget for {0}, so you know how much to spend.',
                    someoneElse: 'Enter the budget for {0}, so {1} know how much to spend.',
                    someoneElseSecret: 'Enter the budget for {0}, so the responsible person knows how much to spend.',
                },
                saveBudget: 'Save Budget',
                saveBudgetForAll: 'Apply budget for all',
                saveBudgetError: 'Error saving budget. Please try again.',
                wishlistTitle: '{0}\'s Wishlist',
                noWishesYet: 'No wishes yet.{0}Tell {1} to add some!',
                giftsTitle: 'Gifts',
                totalBudget: 'Total budget: {0} €',
                giftsInfo: {
                    you: 'The group can buy gifts for up to the total budget of {0}. {1}{2}' +
                        'Everyone can buy a gift, but don\'t forget that {3} are responsible for {4}\'s gifts. ' +
                        'Use the {5} to coordinate who buys what.',
                    someoneElse: 'The group can buy gifts for up to the total budget of {0}. {1}{2} ' +
                        'Everyone can buy a gift, but don\'t forget that {3} is responsible for {4}\'s gifts. ' +
                        'Use the {5} to coordinate who buys what.',
                    someoneElseSecret: 'The group can buy gifts for up to the total budget of {0}. {1} ' +
                        'Use the {5} to coordinate who buys what.',
                    chat: 'chat'
                },
                ifBudgetExceeded: 'If the budget is exceeded, the overspent amount will be covered by {0}.',
                ifBudgetExceededYou: 'you',
                ifBudgetExceededSecret: 'another person|{n} other people',
                noGiftsYet: 'No gifts yet.{0}If you bought something for {1}, add it here!',
                overspentBy: 'Overspent by {0}. The overspent amount will be covered by {1}.',
                overspentByYou: 'you',
                giftBoughtBy: {
                    you: 'by you',
                    someoneElse: 'by {0}',
                },
                expensesSum: 'Sum: {n} €',
                remainingBudget: 'Remaining Budget: {n} €',
                addGift: 'Add Gift',
                flexibleBudget: 'My budget is flexible',
                flexibleBudgetInfo: 'Check this if you\'re willing to exceed your budget if necessary',
                maxBudget: 'The maximum budget you can set is {0} €',
                notJoinedYet: '{0} has not joined the group yet, but you can {1} {0}.',
                notJoinedYetInvite: 'Invite',
            },
            giftDialog: {
                title: {
                    add: 'Add Gift',
                    edit: 'Edit Gift',
                },
                description: 'If you bought a gift for {0}, add it here.',
                name: 'What\'s the gift?',
                price: 'How much did it cost?',
                buyer: 'Who bought it?',
                date: 'When?',
                delete: 'Delete',
            },
            chat: {
                failedToLoad: 'Failed to load chat messages. Please try again.',
                typeMessagePlaceholder: 'Type a message...',
                noMessagesYet: 'No messages yet!{0}Write one to start the chat.',
                noConnection: 'No connection. Retrying...',
                memberCantSee: 'Don\'t worry, {0} can\'t see this chat',
                memberCantSeeShort: '{0} can\'t see this chat',
            },
            balance: {
                title: 'Balance',
                info1: 'Here you can see how to balance the expenses of the group.',
                info2: 'Make sure all budgets and expenses (gifts) have been added before you start to balance!',
                calculation: 'Calculation',
                yourExpenses: 'Your expenses',
                yourExpensesTooltip: 'You bought gifts for {0}',
                yourBudget: 'Your budget',
                yourOverspend: 'Your overspend',
                yourOverspendTooltip: 'Because the group spent more than the available budget for {0}',
                yourUnderspend: 'Your underspend',
                yourUnderspendTooltip: 'Because the group spent less than the available budget for {0}',
                result: 'Result',
                transactions: 'Transactions',
                youNeedToMakeTheseTransactions: 'You need to make these transactions so that the budget is balanced.',
                othersNeedToMakeTheseTransactions: 'Others needs to make these transactions so your budget is balanced.',
                youDontNeedToMakeTransactions: 'You don\'t need to make any transactions.',
                noNeedToMakeTransactions: 'No transactions need to be made, your budget is already balanced!',
                transactionMarkAsDone: 'Mark as done',
            },
            wishlist: {
                title: 'Wishlist',
                description: 'Help your friends know what to get you by adding all your wishes to this list! ' +
                    'Your friends can see this list.',
                placeholder: 'What do you wish for?',
                add: 'Add a wish',
                saved: 'Saved',
                saving: 'Saving...',
                error: 'Error saving wishes. Please try again.',
            },
            notifications: {
                enable: {
                    title: 'Enable Notifications',
                    description: 'Tap here to enable notifications for new messages.',
                    titleSuccess: 'Notifications enabled',
                    descriptionSuccess: 'You will now receive notifications.',

                    dialog: {
                        title: 'Enable Notifications',
                        description: 'To be notified about new messages and gifts, please enable the notifications here.',
                        permissionDenied: 'You denied the permission to receive notifications. To reenable them, you need to go to the site settings in your browser.',
                        error: 'Error enabling notifications. Please try again.',

                        iosMustInstall: 'You are using an iPhone or iPad. Before you can enable notifications, you need to add the website to your home screen.{0}' +
                            '{1} Tap the {2} icon and then "Add to Home Screen".',

                        close: 'Close',
                        dontAskAgain: 'Don\'t ask again',
                        enable: 'Enable Notifications',
                    }
                }
            }
        },
        // MARK: DE
        de: {
            info: {
                name: 'Group Gifts',
            },
            general: {
                you: 'Du',
                name: 'Name',
                today: 'Heute',
                yesterday: 'Gestern',
                close: 'Schließen',
                and: 'und',
            },
            landing: {
                title: 'Weihnachts&shy;geschenke,<br>leicht gemacht',
                subtitle: 'Wunschliste schreiben, Budget festlegen und Geschenke stressfrei organisieren',
                createGroup: 'Gruppe erstellen',
                myGroups: 'Meine Gruppen',
                howItWorks: 'So funktioniert\'s',
                howItWorks1: '<b>Gruppe erstellen</b> und alle anderen einladen',
                howItWorks2: 'Schreibe deine <b>Wunschliste</b> und setze dein <b>Budget</b>',
                howItWorks3: '<b>Chatte</b> um Geschenke zu besprechen',
                howItWorks4: 'Jede*r kauft Geschenke für die Person, die er/sie zugelost bekommen hat',
                tagline: 'Weihnachtsgeschenke, leicht gemacht',
                footerCopyright: 'Filippo © {date}',
            },
            newGroup: {
                title: 'Neue Gruppe',
                groupName: 'Gruppenname',
                groupNamePlaceholder: 'Weihnachten {year}',
                hasMaxBudget: 'Maximales Budget pro Person',
                maxBudgetDescription: 'Jede*r legt ein individuelles Budget für jede*n anderen fest. ' +
                    'Wenn diese Option aktiviert ist, wird das individuelle Budget begrenzt. Das Gesamtbudget pro Person ist die Summe aller Budgets.',
                date: 'Datum',
                members: 'Teilnehmer',
                minimumMembers: 'Eine Gruppe muss mindestens {count} Teilnehmer haben',
                addMember: 'Teilnehmer hinzufügen',
                error: 'Fehler beim Erstellen der Gruppe. Bitte versuche es noch einmal.',
                createGroup: 'Gruppe erstellen',
                creatingGroup: 'Gruppe wird erstellt...',
            },
            invite: {
                title: 'Lade die Teilnehmer ein!',
                description: 'Kopiere diesen Link und sende ihn an deine Freunde, damit sie der Gruppe beitreten können.',
                copy: 'Link kopieren',
                copied: 'Kopiert!',
                done: 'Fertig',
            },
            groups: {
                noGroupsYet: [
                    'Keine Gruppen',
                    {
                        title: 'Bist du bereits einer Gruppe beigetreten?',
                        content: 'Um eine Gruppe, der du bereits beigetreten bist, auf einem anderen Gerät zu sehen, öffne den Einladungslink erneut auf diesem Gerät.'
                    }
                ],
            },
            groupHome: {
                delete: {
                    title: 'Gruppe löschen',
                    description: 'Bist du sicher, dass du die Gruppe {0} löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.',
                    cancel: 'Abbrechen',
                    confirm: 'Gruppe Löschen',
                },
                actions: {
                    balance: 'Bilanz',
                    invite: 'Teilnehmer einladen',
                    settings: 'Gruppeneinstellungen',
                    delete: 'Gruppe löschen',
                    changeMember: 'Teilnehmer ändern',
                },
                tabs: {
                    home: 'Übersicht',
                    wishlist: 'Deine Wunschliste',
                },
                memberNotJoined: '{0} ist der Gruppe noch nicht beigetreten|{0} sind der Gruppe noch nicht beigetreten',
                memberNoBudget: 'Du musst dein Budget für {0} festlegen',
                youAreResponsible: 'Du bist verantwortlich',
                giftFor: 'Geschenk für {0}',
                giftForYou : 'Geschenk für dich ({0})',
            },
            groupSettings: {
                title: 'Gruppeneinstellungen',
                description: 'Hier kannst du die Gruppe bearbeiten.',
                maxBudget: 'Maximales Budget',
                hasMaxBudget: 'Maximales Budget pro Person festlegen',
                save: 'Speichern',
                secretMode: 'Geheimer Modus',
                secretModeDescription: 'Wenn der geheime Modus aktiviert ist, können Mitglieder nur sehen, für wen sie verantwortlich sind, aber nicht, wer für andere Mitglieder verantwortlich ist.',
            },
            join: {
                error: 'Etwas ist schief gelaufen. Bitte öffne den Einladungslink erneut, oder bitte die Person, die dich eingeladen hat, dir einen neuen Link zu senden.',
                errorSorry: 'Entschuldigung',
                title: 'Gruppe beitreten',
                description: 'Du wurdest eingeladen, der Gruppe {0} beizutreten!',
                features: [
                    'Schreibe deine Wunschliste',
                    'Einfacher Überblick über Geschenke für deine Freunde und Familie',
                    'Du musst nur Geschenke für eine Person kaufen, mit einem gemeinsamen Budget'
                ],
                join: 'Gruppe beitreten',
                selectYourName: 'Wer bist du?',
            },
            memberHome: {
                title: 'Geschenk für {0}',
                tabs: {
                    gifts: 'Geschenke',
                    chat: 'Chat',
                },
                whoIsResponsibleInfo: {
                    you: '{0} bist für die Geschenke für {1} verantwortlich',
                    someoneElse: '{0} ist für die Geschenke für {1} verantwortlich',
                },
                mustSetBudget: 'Du hast noch kein Budget für {0} festgelegt.',
                budgetInfo: {
                    you: 'Trage dein Budget für {0} ein, damit du weißt, wie viel du ausgeben kannst.',
                    someoneElse: 'Trage das Budget für {0} ein, damit {1} weiß, wie viel er/sie ausgeben kann.',
                    someoneElseSecret: 'Trage das Budget für {0} ein, damit die verantwortliche Person weiß, wie viel sie ausgeben kann.',
                },
                saveBudget: 'Budget speichern',
                saveBudgetForAll: 'Budget für alle speichern',
                saveBudgetError: 'Fehler beim Speichern des Budgets. Bitte versuche es noch einmal.',
                wishlistTitle: 'Wunschliste von {0}',
                noWishesYet: 'Noch keine Wünsche{0}Bitte {1}, welche hinzufügen!',
                giftsTitle: 'Geschenke',
                totalBudget: 'Gesamtbudget: {0} €',
                giftsInfo: {
                    you: 'Es können Geschenke für bis zu {0} gekauft werden. {1}{2}' +
                        'Jede*r kann ein Geschenk kaufen, aber vergiss nicht, dass {3} für die Geschenke von {4} verantwortlich bist. ' +
                        'Benutze den {5} um zu koordinieren, wer was kauft.',
                    someoneElse: 'Es können Geschenke für bis zu {0} gekauft werden. {1}{2}' +
                        'Jede*r kann ein Geschenk kaufen, aber vergiss nicht, dass {3} für die Geschenke von {4} verantwortlich ist. ' +
                        'Benutze den {5} um zu koordinieren, wer was kauft.',
                    someoneElseSecret: 'Es können Geschenke für bis zu {0} gekauft werden. {1} ' +
                        'Benutze den {5} um zu koordinieren, wer was kauft.',
                    chat: 'Chat',
                },
                ifBudgetExceeded: 'Wenn das Budget überschritten wird, werden die Mehrkosten von {0} getragen.',
                ifBudgetExceededYou: 'dir',
                ifBudgetExceededSecret: 'einer anderen Person|{n} anderen Personen',
                noGiftsYet: 'Es gibt noch keine Geschenke.{0}Wenn du etwas für {1} gekauft hast, füge es hier hinzu!',
                overspentBy: 'Es wurden {0} zu viel ausgegeben. Die Mehrkosten werden von {1} getragen.',
                overspentByYou: 'dir',
                giftBoughtBy: {
                    you: 'von dir',
                    someoneElse: 'von {0}',
                },
                expensesSum: 'Summe: {n} €',
                remainingBudget: 'Verbleibendes Budget: {n} €',
                addGift: 'Geschenk hinzufügen',
                flexibleBudget: 'Mein Budget ist flexibel',
                flexibleBudgetInfo: 'Klicke hier, wenn du bereit bist, dein Budget wenn nötig zu überschreiten',
                maxBudget: 'Das maximale Budget, das du festlegen kannst ist {0} €',
                notJoinedYet: '{0} ist der Gruppe noch nicht beigetreten, aber du kannst {0} {1}.',
                notJoinedYetInvite: 'einladen',
            },
            giftDialog: {
                title: {
                    add: 'Geschenk hinzufügen',
                    edit: 'Geschenk bearbeiten',
                },
                description: 'Wenn du ein Geschenk für {0} gekauft hast, füge es hier hinzu.',
                name: 'Was hast du gekauft?',
                price: 'Wie viel hat es gekostet?',
                buyer: 'Wer hat es gekauft?',
                date: 'Wann?',
                delete: 'Löschen',
            },
            chat: {
                failedToLoad: 'Chatnachrichten konnten nicht geladen werden. Bitte versuche es noch einmal.',
                typeMessagePlaceholder: 'Nachricht schreiben...',
                noMessagesYet: 'Noch keine Nachrichten!{0}Schreibe eine, um den Chat zu starten.',
                noConnection: 'Keine Verbindung. Versuche erneut...',
                memberCantSee: 'Keine Sorge, {0} kann diesen Chat nicht sehen',
                memberCantSeeShort: '{0} kann diesen Chat nicht sehen',
            },
            balance: {
                title: 'Bilanz',
                info1: 'Hier siehst du, wie die Ausgaben der Gruppe ausgeglichen werden können.',
                info2: 'Bevor du mit dem Ausgleich beginnst sollten alle Budgets und Ausgaben (Geschenke) hinzugefügt werden!',
                calculation: 'Berechnung',
                yourExpenses: 'Deine Ausgaben',
                yourExpensesTooltip: 'Du hast Geschenke für {0} gekauft',
                yourBudget: 'Dein Budget',
                yourOverspend: 'Deine Mehrausgaben',
                yourOverspendTooltip: 'Weil mehr als das verfügbare Budget für {0} ausgegeben wurde',
                yourUnderspend: 'Deine Minderausgaben',
                yourUnderspendTooltip: 'Weil weniger als das verfügbare Budget für {0} ausgegeben wurde',
                result: 'Ergebnis',
                transactions: 'Transaktionen',
                youNeedToMakeTheseTransactions: 'Du musst diese Transaktionen durchführen, damit das Budget ausgeglichen ist.',
                othersNeedToMakeTheseTransactions: 'Andere müssen diese Transaktionen durchführen, damit dein Budget ausgeglichen ist.',
                youDontNeedToMakeTransactions: 'Du musst keine Transaktionen durchführen.',
                noNeedToMakeTransactions: 'Es müssen keine Transaktionen durchgeführt werden, dein Budget ist schon ausgeglichen!',
                transactionMarkAsDone: 'Als erledigt markieren',
            },
            wishlist: {
                title: 'Wunschliste',
                description: 'Trage all deine Wünsche auf dieser Liste ein, damit die anderen wissen was sie dir schenken sollen! ' +
                    'Deine Freunde können diese Liste sehen.',
                placeholder: 'Was wünschst du dir?',
                add: 'Wunsch hinzufügen',
                saved: 'Gespeichert',
                saving: 'Wird gespeichert...',
                error: 'Fehler beim Speichern der Wünsche. Bitte versuche es noch einmal.',
            },
            notifications: {
                enable: {
                    title: 'Benachrichtigungen aktivieren',
                    description: 'Tippe hier um Benachrichtigungen zu aktivieren.',
                    titleSuccess: 'Benachrichtigungen aktiviert',
                    descriptionSuccess: 'Du wirst jetzt Benachrichtigungen erhalten.',

                    dialog: {
                        title: 'Benachrichtigungen aktivieren',
                        description: 'Um bei neue Nachrichten, Geschenken benachrichtigt zu werden, aktiviere bitte hier die Benachrichtigungen.',
                        permissionDenied: 'Du hast die Benachrichtigungen abgelehnt. Um sie erneut zu aktivieren, musst du in die Seiteneinstellungen deines Browsers gehen.',
                        error: 'Fehler beim Aktivieren der Benachrichtigungen. Bitte versuche es noch einmal.',
                        iosMustInstall: 'Du benutzt ein iPhone oder iPad. Bevor du Benachrichtigungen aktivieren kannst, musst du die Website zu deinem Startbildschirm hinzufügen.{0}' +
                            '{1} Tippe auf das {2} Symbol und dann "Zum Home-Bildschirm hinzufügen".',

                        close: 'Schließen',
                        dontAskAgain: 'Nicht mehr fragen',
                        enable: 'Benachrichtigungen aktivieren',
                    }
                }
            }
        }
    }
}));
