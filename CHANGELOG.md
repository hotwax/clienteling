# Clienteling app changelog
The latest version of this file can be found at the master branch of the
clienteling repository.

## 1.14.2 (2021-02-17)
## Implemented
- [23935f](https://app.clickup.com/t/23935f) Implemented registerQuickSale functionality by integrating createProductVariance API !820

## Improved
- [21bpqu](https://app.clickup.com/t/21bpqu) Improved settings page by adding the UI to register the quick sale !819

## 1.14.1 (2021-02-08)

## Improved
- [23dmfq](https://app.clickup.com/t/23dmfq) Improved quick ship process for delivery items !808

## Fixed

- [239cwa](https://app.clickup.com/t/239cwa) Fixed an issue where state is not working fine on re-login the app !807

## 1.14.0 (2021-01-29)

## Implemented
- [156pry](https://app.clickup.com/t/156pry) Implemented State Management for Shopping Cart using NGXS !704
- [1t8ecf](https://app.clickup.com/t/1t8ecf) Implemented state management for customer data using NGXS library !772
- [1teuku](https://app.clickup.com/t/1teuku) Implemented modal to filter the products as per the categories !773

## Fixed
- [1tck26](https://app.clickup.com/t/1tck26) Fixed an issue where system showing error while adding anonymous customer for order !794
- [1n9buu](https://app.clickup.com/t/1n9buu) Fixed an issue where newly added phoneNumber not displayed on shipping form !799
- [21a0mu](https://app.clickup.com/t/21a0mu) Fixed an issue where back navigation not working fine due to improper state management through alternateProducts !800

## Improved
- [1t8bbu](https://app.clickup.com/t/1t8bbu) Improved logic to apply coupon using state actions !775
- [1xdqxh](https://app.clickup.com/t/1xdqxh) Improve cart logic to dynamically render view cart data !790
- [1vg750](https://app.clickup.com/t/1vg750) Improved display of orders as per the shipGroup by optimising the code !792
- [1z97un](https://app.clickup.com/t/1z97un) Improved logic for cart state with cart properties direclty used as state properties !793
- [1vaedv](https://app.clickup.com/t/1vaedv) Improved product page by displaying the alternateProducts using scrollable slides !795
- [1zat2t](https://app.clickup.com/t/1zat2t) Improved logic to use customer partyId using selector !796
- [1n9b2k](https://app.clickup.com/t/1n9b2k) Improved display of updated email and phone on customer page !803
## 1.13.0 (2021-01-04)

## Implemented
- [1vf72h](https://app.clickup.com/t/1vf72h) Added province data for Italy to display the stateName on store-locator page !786

## Fixed
- [1vbmx0](https://app.clickup.com/t/1vbmx0) Fixed an issue where loader continous running on login page, if logged-in user not associated with the store !782
- [1vcf1a](https://app.clickup.com/t/1vcf1a) Fixed an issue where loader continous running, if we dont get any response in wms-orders or readytoshiporders API !785

## 1.12.1 (2020-12-23)

- [1v828y](https://app.clickup.com/t/1v828y) Improved display of orders as per the ship-group on activity segment -m !781

## 1.12.0 (2020-12-21)

## Improved
- [1t8fb7](https://app.clickup.com/t/1t8fb7) Improved reserveItem process, user should not be able to reserve product if out of stock for other store !766
- [1n8m3w](https://app.clickup.com/t/1n8m3w) Improved product page by displaying the additional images using slide !768
- [1qfwq7](https://app.clickup.com/t/1qfwq7) Displayed product brandname in all over the app !769
- [1qck6g](https://app.clickup.com/t/1qck6g) Improved product page to display the detail-image with height as per the theme !771
- [1v828y](https://app.clickup.com/t/1v828y) Improved shipmentMethod and carrierParty for in-store items !776
- [1qck8v](https://app.clickup.com/t/1qck8v) Added required UI labels that were remaining mistakenly !777
- [1qaake](https://app.clickup.com/t/1qaake) Improved display of productPrice as per the selected variant !778

## 1.11.1 (2020-12-10)

## Improved
- [1n8m3w](https://app.clickup.com/t/1n8m3w) Improved product page by displaying the additional images using slide !768
- [1qfwq7](https://app.clickup.com/t/1qfwq7) Displayed product brandname in all over the app !769

## 1.11.0 (2020-12-08)
## Implemented
- [156prm](https://app.clickup.com/t/156prm) Implemented State Management for products data using NGXS library !674
- [13az3r](https://app.clickup.com/t/13az3r) Implemented functionality to change the current store from settings page !707
- [39nzjp](https://app.clickup.com/t/39nzjp) Implemented functionality to add/edit phoneNumber by integrating telecomNumber API !758

## Improved
- [1n8p5h](https://app.clickup.com/t/1n8p5h) Improved display of date as per appropriate timezone using moment-timezone library !759
- [1qa1zh](https://app.clickup.com/t/1qa1zh) Improved customer page to add/edit emailAddress by replacing alert with modal !760
- [1qck8v](https://app.clickup.com/t/1qck8v) Added json to display UI labels in italian languauge !761
- [1qck91](https://app.clickup.com/t/1qck91) Improved order-fulfillment page by displaying the channel name !763
- [1t8a0c](https://app.clickup.com/t/1t8a0c) Improved order fulfillment screen to display the items detail without custom component !764
- [1qfxzr](https://app.clickup.com/t/1qfxzr) Improved product page to display composition and washing instructions !765

## Fixed
- [1n9550](https://app.clickup.com/t/1n9550) Fixed an issue where entered phone number is not displayed on shipping form for placing an order !756

## 1.10.2(2020-11-30)

- [1qb2ew](https://app.clickup.com/t/1qb2ew) Improved display of detail image on product and login page, also added default locale !762

## 1.10.1 (2020-11-17)

- [1n9550](https://app.clickup.com/t/1n9550) Fixed an issue where entered phone number is not displayed on shipping form for placing an order !757
## 1.10.0 (2020-11-11)

## Implemented

- [1h9rv8](https://app.clickup.com/t/1h9rv8) Implemented functionality to change the environment and config file at runtime before building the app !733

## Improved

- [1h9vu2](https://app.clickup.com/t/1h9vu2) Improved localization using angular-l10n module !746
- [1h9vu7](https://app.clickup.com/t/1h9vu7) Improved locale in all over the app by replacing the JSON file for translation !747
- [1h9vud](https://app.clickup.com/t/1h9vud) Improved display of date in all over the app using l10nDate pipe with date-format as custom component !748
- [1ke420](https://app.clickup.com/t/1ke420) Improved shipmentMethodTypeId and carrierPartyId by making them configurable using environment file !750
- [1kf3au](https://app.clickup.com/t/1kf3au) Improved display of orders as per the shipGroup also improved button labels !753

## Fixed

- [1kedgj](https://app.clickup.com/t/1kedgj) Fixed an issue where the baseURL conflicts with OMS_URL !751
- [1keybh](https://app.clickup.com/t/1keybh) Fixed an issue where Checking inventory label keeps on display on product page if we get the zero quantity from the server !752

## 1.9.0 (2020-10-26)

## Implemented
- [2vpf95](https://app.clickup.com/t/2vpf95) Implemented UI for orderPickup flow !535
- [199q8p](https://app.clickup.com/t/199q8p) Integrated wms-orders API for displaying orders !705
- [19b6tp](https://app.clickup.com/t/19b6tp) Integrated quickShipEntireShipGroup, readytoshiporders and updateShipment API !706
- [1dcz9e](https://app.clickup.com/t/1dcz9e) Implemented handover functionality on packed orders segment !719
- [1fcqht](https://app.clickup.com/t/1fcqht) Implemented custom component to display the product recommendation card !722

## Improved
- [1d8q64](https://app.clickup.com/t/1d8q64) Improved bundleId and version as same as we used for testflight !717
- [1f7jfm](https://app.clickup.com/t/1f7jfm) Improved display of label along with the checkbox on return-items page as per the value of returnableItem !721
- [176et9](https://app.clickup.com/t/176et9) Improved product detail page by displaying browsed products after rating section !723
- [1h70pe](https://app.clickup.com/t/1h70pe) Improved return order page by removing the start return button and make the whole card clickable !725
- [1h7gx2](https://app.clickup.com/t/1h7gx2) Improved activation of process refund button as per the value of selected reason and selected items !728
- [1h7h2x](https://app.clickup.com/t/1h7h2x) Improved confirmation that is displayed while navigating back from payment to shopping cart page !729
- [1h70mt](https://app.clickup.com/t/1h70mt) Improved payment page by removing secondary color from balance label !730
- [1h70ny](https://app.clickup.com/t/1h70ny) Improved display of range on reservation page along with labels and pin !731
- [1he1en](https://app.clickup.com/t/1he1en) Improved return items page by displaying the in-store facilityName and order status !738
- [1heeje](https://app.clickup.com/t/1heeje) Improved product detail page by displaying the label on changing the product variants !742

## Fixed
- [17ccc7](https://app.clickup.com/t/17ccc7) Fixed an issue where empty-state-image overlaps the searchbar on cart and store locator page !720
- [1h70mx](https://app.clickup.com/t/1h70mx) Fixed an issue of spacing on payment card by wrapping in ion-item with no-padding attribute !727
- [1h7gah](https://app.clickup.com/t/1h7gah) Fixed an issue where the sequence of features is inconsistent in all over the app, size should be displayed after color !732
- [1hd3pm](https://app.clickup.com/t/1hd3pm) Fixed an issue where inventory does not show up on product detail page due to caching !734
- [1hd3mp](https://app.clickup.com/t/1hd3mp) Fixed an issue where unselection of checkbox is not working fine for cancelling the items !735
- [1hd4n5](https://app.clickup.com/t/1hd4n5) Fixed flickering issue while infinite scrolling on bopis tab !736
- [1he32g](https://app.clickup.com/t/1he32g) Fixed loading element should be removed after checking stock for product details page !739

## 1.8.0 (2020-09-21)

## Implemented
- [156prh](https://app.clickup.com/t/156prh) Implemented State Management for Authentication using NGXS library !668
- [17c413](https://app.clickup.com/t/17c413) Added prettier for handling formatting !701
- [17c535](https://app.clickup.com/t/17c535) Added instructions for generating documentation using compodoc !702
- [1be393](https://app.clickup.com/t/1be393) Add Return product as credit payment preference in cart !712

## Improved
- [1bd8v5](https://app.clickup.com/t/1bd8v5) Improved shopping cart page by displaying return icon only if the customer is added !709
- [1be8pm](https://app.clickup.com/t/1be8pm) Improved creation of order-return irrespective of the selection of useCreditOnNextPurchase checkbox !711
- [1beyfc](https://app.clickup.com/t/1beyfc) Improved process-return and return-items page by setting the default value for radio of paymentMethod and dropdown of return reasons !713
- [1beygx](https://app.clickup.com/t/1beygx) Improved order total to show value deduced with store credit applied !714

## Fixed
- [19ba6v](https://app.clickup.com/t/19ba6v) Fixed continues loader running on the screen after creating a new customer !708
- [1bdhk9](https://app.clickup.com/t/1bdhk9) Fixed unexpected behaviour of the Process refund button for return flow !710

## 1.7.0 (2020-08-25)

## Implemented
- [6ra8cd](https://app.clickup.com/t/6ra8cd) Integrated Returns APIs and completed the return flow !659
- [68a92p](https://app.clickup.com/t/68a92p) Implemented UI for orderReturn flow  !511
- [157gwz](https://app.clickup.com/t/157gwz) Enabled search functionality on order history, search orders by orderId and product name !675

## Improved
- [3hpbku](https://app.clickup.com/t/3hpbku) Added a text string into en.json and use in return order page !650
- [3hpcwq](https://app.clickup.com/t/3hpcwq) Image rendering code and use innerHtml to display heading in ORDER Return page and use (?)to display the value on page !651
- [3hujah](https://app.clickup.com/t/3hujah) Integrated selected order items data on return item page !656
- [3nqaxe](https://app.clickup.com/t/3nqaxe) Comment out recommendation segment from home page !655
- [3nqayc](https://app.clickup.com/t/3nqayc) Replace image render from component instead of it directly render by img tag !657
- [13e7fh](https://app.clickup.com/t/13e7fh) Enabled search functionality on return-order screen !695
- [15bjfn](https://app.clickup.com/t/15bjfn) Enabled tap event on recommended products !672
- [157ddp](https://app.clickup.com/t/157ddp) Removed qty from order history line items !670
- [176dcx](https://app.clickup.com/t/176dcx) Added class border-top in global css file !683
- [176enu](https://app.clickup.com/t/176enu) Added item-start slot for icon in list divider !682
- [176f9k](https://app.clickup.com/t/176f9k) Removed payment method methods from order card on order history page #176f9k !677
- [176ff8](https://app.clickup.com/t/176ff8) Changed orderDate tag from h1 to h2 !678
- [176fga](https://app.clickup.com/t/176fga) Added shipping address in order history delivery items !679
- [179rh8](https://app.clickup.com/t/179rh8) Removed no-lines from quantity on edit cart screen !686
- [179un2](https://app.clickup.com/t/179un2) Display text Quantity instead of Qty on edit cart page !687
- [179x5m](https://app.clickup.com/t/179x5m) Changed title of Add address to New address modal !693

## Fixed
- [178pxk](https://app.clickup.com/t/178pxk) Fixed continues infinite loader customer search !697
- [178p0f](https://app.clickup.com/t/178p0f) Fixed issue with category filter when removing the category filter !698
- [178h56](https://app.clickup.com/t/178h56) Fixed last recommendations of customer are not cleared when we re-login into App !629
- [177k1k](https://app.clickup.com/t/177k1k) Fixed existing logic of in-store filter !680
- [156pqt](https://app.clickup.com/t/156pqt) Fixed Order date on customer detail page !669
- [3kv83m](https://app.clickup.com/t/3kv83m) Fixed orders not visible on customers Activity section !667
- [3hm6nd](https://app.clickup.com/t/3hm6nd) Fixed image issue on recommended products !671

## 1.6.0 (2020-07-24)

### Improved
- [3hvpe2](https://app.clickup.com/t/3hvpe2) Fixed the issue of tender input field on credit card payment page !658

## 1.5.2 (2020-07-16)

### Improved
- [3nqaxe](https://app.clickup.com/t/3nqaxe) Comment out recommendation segment from home page !655
- [3nqayc](https://app.clickup.com/t/3nqayc) Replace image render from the component by applying a check is image belongs to local assets folder !657

## 1.5.0 (2020-07-11)

### Improved
- [3frkzn](https://app.clickup.com/t/3frkzn) Improved image component by adding the resourceUrl in component itself !640
- [3fvpr4](https://app.clickup.com/t/3fvpr4) Improved reserve item UI by adding a badge instead on note and remove separate ion-item wrapper !645
- [8udabg](https://app.clickup.com/t/8udabg) Updated logout button markup by removing ion-item !647
- [8wj90d] (https://app.clickup.com/t/8wj90d) Fixed issue by applying condition on entered amount and reset amount !648
- [8udaaq](https://app.clickup.com/t/8udaaq) Added card and store icons on more menu !649

## 1.4.1 (2020-07-01)

### Improved
- [3fp9jr](https://app.clickup.com/t/3fp9jr) Improved path of empty state images and set autoFocus on input on credit-card page !638
- [84bxc5](https://app.clickup.com/t/84bxc5) Removed card from analytics segment on customer page !639
- [84bxq5](https://app.clickup.com/t/84bxq5) Updated condition to add success and danger color on enteredAmount on addCash page  !641
- [8chgpm](https://app.clickup.com/t/8chgpm) Improved UI and range label for pickup date on reserveItem page !642

## 1.4.0 (2020-06-27)
### Implemented
- [2knn97](https://app.clickup.com/t/2knn97) Implemented logic for clover go payment !425
- [3fmgrx](https://app.clickup.com/t/3fmgrx) Implemented reuseable animation for list and card !633
- [84bxc5](https://app.clickup.com/t/84bxc5) Implemented new UI on home page for displaying customer analytics under recommendations segment !618

### Improved
- [84bwvy](https://app.clickup.com/t/84bwvy) Improved shipping form by displaying the address using card also removed action
  sheet from product page !603
- [84bwjm](https://app.clickup.com/t/84bwjm) Aligned tender button on top of numberpad on add payment screen !602
- [84fwwe](https://app.clickup.com/t/84fwwe) Improved display of categories on home page using chips and it will be multi
  selectable also moved searchbar from toolbar to content !605
- [84bxq5](https://app.clickup.com/t/84bxq5) Replace “tender” with the total amount due and use danger and success colors on amount being tendered. !604
- [1xnqg6](https://app.clickup.com/t/1xnqg6) Added empty state image on store locator page !608
- [8chkud](https://app.clickup.com/t/8chkud) Improved displaying of feature on editCartItem page by removing the unselected features, as per the updated mockup only selected features will be displayed !615
- [8agaz0](https://app.clickup.com/t/8agaz0) Improved display of store pickup, used Pickup from UI label before the storeName !616
- [8chbub](https://app.clickup.com/t/8chbub) Added lines and inline label on input fields in create customer form !619

- [2htefu](https://app.clickup.com/t/2htefu) Integrated custom npm for enabling customer analytics !621
- [8agfg4](https://app.clickup.com/t/8agfg4) Improved page title of store locator page !624
- [8ch99u](https://app.clickup.com/t/8ch99u) Autofill customer first name, last name and phonenumber on delivery form !620
- [39ppyz](https://app.clickup.com/t/39ppyz) Added missing uiLabel for store on settings page !599
- [8cg3wu](https://app.clickup.com/t/8cg3wu) Improved addAddress screen for directly adding the item into cart !622
- [3du1fd](https://app.clickup.com/t/3du1fd) Improved display of image using ionic component instead of ionic page !626
- [8chgpm](https://app.clickup.com/t/8chgpm) Improved UI of reserveItem page for displaying pickup-up date options !627
- [3dp1yr](https://app.clickup.com/t/3dp1yr) Handled navParams consistently in all over the app !625
- [8mhu2g](https://app.clickup.com/t/8mhu2g) Improved shipping page by making the whole item tappable instead of radio icon only !628
- [8gm6kr](https://app.clickup.com/t/8gm6kr) Improved filter chips of order history on customer page !632
- [8pguv3](https://app.clickup.com/t/8pguv3) Improved login page by adding default credentials !629

### Fixed
- [3bpk8d](https://app.clickup.com/t/3bpk8d) Fixed an issue where incorrect city fetched by address auto completer in delivery address form !610
- [8ch89p](https://app.clickup.com/t/8ch89p) Fixed an issue where customer details disappear before ending session !611
    
## 1.3.0 (2020-06-12)
### Improved
- [2zjvnu](https://app.clickup.com/t/2zjvnu) Added productStoreId as param while searching the product as per the recent changes in API !545
- [2xr98h](https://app.clickup.com/t/2xr98h) Added ellipsis to productName in all over the app !543
- [2xr3a8](https://app.clickup.com/t/2xr3a8) Added item-start attribute on ion-icon to avoid the space inconsistency between icon and label !541
- [70e7ra](https://app.clickup.com/t/70e7ra) Added stagger animation on home page to display product list !546
- [2zp5fz](https://app.clickup.com/t/2zp5fz) Added transition on payment page for adding and removing the card !559
- [7eeaaa](https://app.clickup.com/t/7eeaaa) Added placeholder space for image on product page !577
- [2xqwen](https://app.clickup.com/t/2xqwen) Hide bottom tabs on the sub pages of shopping cart tab !540
- [2xnqyt](https://app.clickup.com/t/2xnqyt) Displayed out of stock popup for anonymous user same as registered user !539
- [2xmhjv](https://app.clickup.com/t/2xmhjv) Implemented functionality to add/edit emailAddress on customer page !538
- [4gc91k](https://app.clickup.com/t/4gc91k) Improved settings page by displaying storeName above logout button !548
- [2vpjcd](https://app.clickup.com/t/2vpjcd) Made numberPad component generic so that it can be use in all over the app !531
- [2zjxkg](https://app.clickup.com/t/2zjxkg) Disabled loader for cached data !566
- [4m96pt](https://app.clickup.com/t/4m96pt) Sync shipping address from PWA !522
- [2xkp98](https://app.clickup.com/t/2xkp98) Integrated an email/receipt API !536
- [2vrnv4](https://app.clickup.com/t/2vrnv4) Grouped other stores by state on store locator page !544
- [5panaf](https://app.clickup.com/t/5panaf) Integrated order-history API !452
- [2hjgu5](https://app.clickup.com/t/2hjgu5) Improved home page by displaying the searchbar under toolbar !502
- [7ahbax](https://app.clickup.com/t/7ahbax) Displayed orderPart details, also added removeItem functionality on editCartItem page !572
- [7edzw1](https://app.clickup.com/t/7edzw1) Added masking for phone number on bases of country !578
- [33kcwe](https://app.clickup.com/t/33kcwe) Replaced app icon as shared by Aditya P !571
- [7ee8un](https://app.clickup.com/t/7ee8un) Added animation on chip while selecting the features on product page !584
- [37t2p1](https://app.clickup.com/t/37t2p1) Added image for the empty cart !587
- [35k202](https://app.clickup.com/t/35k202) Removed calling of saveCartToAutoSaveList API because currently it does nothing on server side !579
- [7ahv4z](https://app.clickup.com/t/7ahv4z) Improved markup of customer dashboard page as per the latest standards !580
- [1xnqg6](https://app.clickup.com/t/1xnqg6) Implementing functionality to sort and filter the other stores !573
- [39ppyz](https://app.clickup.com/t/39ppyz) Added UI label for store !599

### Fixed 
- [2vtnnk](https://app.clickup.com/t/2vtnnk) Fixed condition on home page to display only those categories in the menu that are having products !537
- [2ttth5](https://app.clickup.com/t/2ttth5) Fixed an issue of empty imageURL and error on imageURL by adding default image !560
- [2zpb6u](https://app.clickup.com/t/2zpb6u) Fixed an issue where loader keeps on running on infinite scrolling while searching the product !581
- [2vm5kb](https://app.clickup.com/t/2vm5kb) Fixed an issue of login by handling the empty object in the response of login API !514
- [2vpgk4](https://app.clickup.com/t/2vpgk4) Fixed an issue where user gets logout when the google token is expire !558
- [2vr8fq](https://app.clickup.com/t/2vr8fq) Fixed an issue where phoneNumber not displays for the newly created customers
- [7ahxkk](https://app.clickup.com/t/7ahxkk) Fixed an issue where email is autofilled on email receipt for the anonymous user !570
- [2zpb6u](https://app.clickup.com/t/2zpb6u) Fixed an issue where searched keyword not persist in the searchbar !557
