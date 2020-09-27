## GT Food Truck 

 
Project Purpose 
In this project you will analyze, specify, design, implement, document and demonstrate an online system. You are required to use the classical methodology for database development. The system will be implemented using a relational DBMS that supports standard SQL queries. You will use your localhost MySQL Server (Version 5.1 or above) to implement your database and the application. You also cannot use any other software like Access or SQLite.
 
Project Description 
Introduction 
In this project, you can your teammates will design and implement a food truck system with the following requirements using relational database concepts. 
General Notes: 
1.	Data for all dropdown lists come from the database:  . NOT hardcoded. 
2.	All text fields are optional unless specified otherwise. For filtering, if the text field is filled, its contents must match exactly with contents in the database unless specified otherwise. 
3.	You don’t have to sort the table columns unless specified in the notes. 
4.	In the case for update and delete, you must select an item in the table first 
5.	Radio button indicates the selection is single  ; check box indicates the selection can be multiple   
6.	All number and date ranges in the filter criteria are inclusive 
Screen 1: Login 
 
Notes: 
1. Valid “username” and “password” combinations (i.e. exists in the database) are needed for login. 
 
 
Notes: 
1.	User will be registered as a customer, an employee, or both 
  a.	If “balance” given, user will be a customer 
  b.	If “email” given, user will be an employee 
  i. Employees must select exactly one of Admin, Manager, or Staff 
  c.	If both “balance” and “email” are given, user will be both an employee and a customer 
2.	“Username” is unique for all users; the combination of “First Name” and “Last Name” is unique for all users 
3.	“Username”, “First Name”, “Last Name”, “Password”, “Confirm Password” are required for all users 
  a.	Stored the hashed password instead of the literal password in the database 4. Additional constraints: 
  a.	“Balance” (if filled) must be positive 
  b.	“Password” must have length of at least 8 
  c.	“Password” and “confirm password” should match for a valid registration 
  d.	“Email” (if filled) must be in the form of _______@___.___ 
 
Notes: 
1.	A customer can  
  a.	Explore the system& change current location(Screen 16) 
  b.	View current information (current location and remaining balance) (Screen 17) 
  c.	Place and order (Screen 18) 
  d.	View Order History (Screen 19) 
2.	A manager can 
  a.	Manage the food trucks they create (Screen 11) 
  b.	View summaries for the food trucks that they create (Screen 14) 
3.	An admin can 
  a.	Manage (all) buildings and stations on campus (Screen 4) 
  b.	Create new food for food trucks (Screen 10) 
 
Screen 4: Admin Manage Building & Station 
 
Notes: 
1.	Admin can search for buildings and stations here. Once selected, the admin can update or delete the selected building/station. Additionally, the admin can navigate to the “Create Building” (Screen 5) and “Create Station” (Screen 7) screens from here. 
2.	Filter criteria for “capacity” is inclusive 
3.	The “Building Tag” filter should filter for any buildings that have any tags that contain a partial match with the text entered.   
4.	The “Tag” column should display all the tags of the building 
5.	The “Food Truck(s)” column displays all names of the food trucks located in the station 6. A building may have at most one station 
  
Screen 5 Admin Create Building 
Notes: 
1. A building must have a “name”, “description”, and at least one “tag” 
  a.	The “name” is unique across all buildings 
  b.	“Tags” are descriptors for the building, such as ADA, chemistry building, labs, etc. 
  
Screen 6 Admin Update Building Notes: 
1.	Follow same notes as Create Station (Screen 5) 
2.	Fields should be prepopulated with the selected building’s information 
 
 
Screen 7: Create Station 
 
Notes: 
1.	All fields are required 
2.	Station name is unique across all stations 
3.	Each station has a positive capacity, which is the maximum number of food trucks it can hold 
4.	A station must be sponsored by exactly one building 
5.	Content in the sponsored building dropdown includes only the available buildings (i.e. 
buildings that have not been assigned to any station) 
 
Screen 8: Admin Update Station 
 
Notes 
1.	Follow notes from Screen 7 
2.	Cannot update station name 
3.	Fields prepopulated based on information selected in Screen 4 

Screen 9: Admin Manage Food 

Notes: 
1.	All columns are sortable 
2.	“Menu count” counts the number of times a food shows up in the food trucks’ menus 
a. Food with same name but different prices count as different food 
3.	“Purchase count” shows the number of times a food gets purchased by any customer  
4.	The food names in the table are unique 
 
Screen 10 Admin Create Food 

Notes: 
1.	“Name” is unique for all food 
2.	“Name” is required when creating a food 
 
Screen 11

Notes 
1.	Manager can ONLY manage the food trucks they create (i.e. food trucks they manage) 
2.	Food truck name needs a partial match if filled 
  a.	“Food Truck Name(contain)” means that we could search for Food Truck Names that contain the word(s) in the search box.  
3.	“#Menu Item” is the number of menu items in that food truck 
4.	“Station Name” is a drop down 
5.	“Staff Count” is inclusive. It is the number of staff working in that food truck. 
6.	“Remaining Capacity” is the remaining capacity for the station 
  a.	If “Has Remaining Capacity” is checked, only stations with positive remaining capacity is shown 
   
Screen 12 Manager Create Food Truck 
 
Notes 
1.	All fields are required 
2.	A manager can create multiple food trucks (i.e. they can manage multiple food trucks) 
3.	“Name” is unique for all food trucks 
4.	A food truck must be hosted in exactly one station, which must have a positive remaining capacity. 
5.	Manager assign at least one available staff to each food truck (a staff member is available when they are not assigned to other food trucks) 
a. Displays staff’s first name and last name in the list 
6.	Each food truck must have at least one menu item 
7.	For menu items, foods with same name may have different prices in the same food truck (e.g. food Apple can have prices 3.99 and 4.99, see the UI above) 
8.	Each food truck CANNOT have the same food (i.e. food name) listed twice in their menu 
 
  
Screen 13 Manager Update Food Truck Notes: 
1.	See notes from Screen 12 
2.	Fields prepopulated with information selected in Screen 11 
3.	Manager can only add new menu items (i.e. cannot delete existing menu items) 
 
Screen 14: Manager Food Truck Summary 
 
Notes 
1.	All columns are sortable 
2.	“#Total Order” is the total number of orders of a food truck with the given filter criteria 
3.	“#Customer” is the total number of distinct customers who made a purchase in the food truck with the given filter criteria 
4.	“Total Revenue” is the amount of money made with the given filter criteria 
5.	Only the stations managed by the manager will be displayed in the “Station Name” dropdown 
 
Screen 15: Manager Summary Detail 
 
 
Notes 
1.	Results are ordered by “Date” in descending order 
2.	This page should detail the orders that all customers made to the Food Truck on a given date 
  a.	“Total purchase” shows the sum of prices in each order a customer placed on the given date 
  b.	“# Orders” is the total number of orders a customer placed on the given date 
  c.	“Food(s)” contain all the distinct food names a customer purchased on the given date 
 
Screen 16: Customer Explore 
 
Notes 
1.	Customer can select a station as their current location 
2.	“Food truck(s)” contains all the food trucks located in the station 
3.	“Food(s)” contains all the distinct food (names) sold by any food trucks in the station 
 
Screen 17: Customer Current Information 
 
Notes 
1.	Customer need to select a food truck in their current location to place an order 
2.	“Balance” displays the remaining balance of the customer 
  
Screen 18 Customer Order 
Notes 
1.	Menu items are displayed for the selected food truck 
2.	Customer place an order with at least one menu item from the food truck selected 
  a. Must include a positive purchase quantity when purchasing that food item 
3.	Order date is required, but customer can place multiple orders on the same date 
4.	Total cost of the order must not be greater than the customer’s current balance. Deduct the corresponding amount from the current balance when the order is successfully placed 
5.	A 10-digit unique order ID will be generated for each order. 
 
Screen 19: Customer Order History 
 
Notes 
1.	Customer can see their order history. 
2.	“Order total” is the total amount purchased in that order 
3.	“Food(s)” contain the distinct food (names) purchased 
4.	“Food quantity” is the total quantity of food purchased in that order 
 
 
 
