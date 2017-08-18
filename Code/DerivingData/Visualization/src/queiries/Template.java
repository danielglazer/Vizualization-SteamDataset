package queiries;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONObject;

public class Template {

	public static void main(String[] args) {
		/*
		 * for(x){ // countries for(y){ // states for(z){ // cities
		 * 
		 * query select * where x==country && y=state && z= city update } } }
		 */

		String filename = "steam_countries.json.txt";
		/*
		 * Country [] countries = gson.fromJson(reader, Country.class); State []
		 * states = gson.fromJson(reader, State.class); City [] cities =
		 * gson.fromJson(reader, City.class); System.out.println(countries);
		 */

		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();

			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/steam_dataset", "root", "root");
			/*
			Statement stmn = conn.createStatement();
			String create_table = "Create Table Gifts(name Varchar(20))";
			stmn.executeUpdate(create_table);
			*/
			/*
			JsonObject jsonobj = new JsonObject();
			*/
			
			String content = readFile(filename, StandardCharsets.UTF_8);
			JSONObject jsonobj = new JSONObject(content);
			Map<String, Object> countriesMap = jsonobj.toMap();
			//System.out.println(countriesMap.values() + "  " + countriesMap.keySet());
			
			/*We want to iterate for each country */
			for (Entry<String, Object> country_entry : countriesMap.entrySet())
			{
				String country_key = country_entry.getKey();
				Map<String, Object> country_map = (Map<String, Object>) country_entry.getValue();
				String country_name = (String) country_map.get("name");

				String country_coordinate_xy = (String) country_map.get("coordinates"); // split(,)
				if(country_coordinate_xy == null)
				{
					continue;
				}
				String [] temp_coordinates = country_coordinate_xy.split(",");
				String country_coordinate_x = temp_coordinates[0];
				String country_coordinate_y = temp_coordinates[1];
				
				String country_accuracy_level = (String) country_map.get("coordinates_accuracy_level");
				Map <String, Object> states = (Map<String, Object>)country_map.get("states");
//				count x; // TODO
//				count y 
//				count z
				/*We want to iterate for each state */
				for (Entry<String, Object> state_entry : states.entrySet())
				{
					String state_key = state_entry.getKey();
					Map<String, Object> state_map = (Map<String, Object>)state_entry.getValue();
					String state_name = (String) state_map.get("name");
					
					String state_coordinate_xy = (String) state_map.get("coordinates");
					if(state_coordinate_xy == null)
					{
						continue;
					}
					temp_coordinates = state_coordinate_xy.split(",");
					String state_coordinate_x = temp_coordinates[0];
					String state_coordinate_y = temp_coordinates[1];
					
					String state_accuracy_level = (String) state_map.get("coordinates_accuracy_level");
					Map <String, Object> cities = (Map<String, Object>)state_map.get("cities");
					
				    /*We want to iterate for each city */
				    for (Entry<String, Object> city_entry : cities.entrySet())
					{
				    	String city_key = city_entry.getKey();
						Map<String, Object> city_map = (Map<String, Object>)city_entry.getValue();
						String city_name = (String) city_map.get("name");
						
						String city_coordinate_xy = (String) city_map.get("coordinates");
						if(city_coordinate_xy == null)
						{
							continue;
						}
						temp_coordinates = city_coordinate_xy.split(",");
						String city_coordinate_x = temp_coordinates[0];
						String city_coordinate_y = temp_coordinates[1];
						
						String city_accuracy_level = (String) city_map.get("coordinates_accuracy_level");
						
					}
				}
				
				// UPDATE country_name (SELECT where column_name == key)
			}
			
			System.out.println("done");
			
			
			
			
			
			
		} catch (Exception ex) {
			ex.printStackTrace();
			/* handle the error */}

		
	}
	static String readFile(String path, Charset encoding) 
			  throws IOException 
			{
			  byte[] encoded = Files.readAllBytes(Paths.get(path));
			  return new String(encoded, encoding);
			}
}
