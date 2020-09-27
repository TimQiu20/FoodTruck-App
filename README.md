## GT Food Truck 
### Instruction of how to build the APP
1. Install npm from https://www.npmjs.com/get-npm  
2. Run the database using one of the following commands:  
  a. Direct to Phase4 and run modified_db.sql in terminal  
  b. Open modified_db.sql in MySQL Workbench and run the script
3. Open FoodTruckApp folder in your preferred text editor, Rename .env.default to .env,
and add your local settings (below is an example of default)
  a. NODE_ENV = DEVELOPMENT  
  b. DB_HOST =localhost  
  c. DB_USER =root  
  d. DB_PASSWORD =’’  
  e. DB_NAME =cs4400spring2020  
4. Direct to FoodTruckApp root folder in terminal in the following sequence
  a. Phase4
  b. FoodTruckApp
5. Run ‘npm install’
6. Run ‘npm dev run’ to get the website address
7. Open the URL (Default to be Localhost: 3000) it directs in a new window to load
welcome page
 
### Project Purpose 

In this project we analyze, specify, design, implement, document and demonstrate an online system. We use the classical methodology for database development. The system will be implemented using a relational DBMS that supports standard SQL queries. We use your localhost MySQL Server (Version 5.1 or above) to implement out database and the application.
 
### Project Description 
Introduction 
In this project, we design and implement a food truck system with the following requirements using relational database concepts. 
General Notes: 
1.	Data for all dropdown lists come from the database:  . NOT hardcoded. 
2.	All text fields are optional unless specified otherwise. For filtering, if the text field is filled, its contents must match exactly with contents in the database unless specified otherwise. 
3.	You don’t have to sort the table columns unless specified in the notes. 
4.	In the case for update and delete, you must select an item in the table first 
5.	Radio button indicates the selection is single  ; check box indicates the selection can be multiple   
6.	All number and date ranges in the filter criteria are inclusive 
