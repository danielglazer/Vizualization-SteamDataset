	package queiries;
	
	import java.io.FileReader;
	import java.io.IOException;
	import java.io.Reader;
	import java.nio.charset.Charset;
	import java.nio.charset.StandardCharsets;
	import java.nio.file.Files;
	import java.nio.file.Paths;
	import java.sql.Connection;
	import java.sql.DriverManager;
	import java.sql.PreparedStatement;
	import java.util.Map;
	import java.util.Map.Entry;
	import org.json.JSONObject;

	public class AddLocation {

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

//				JsonObject jsonobj = new JsonObject();
				
				String content = readFile(filename, StandardCharsets.UTF_8);
				JSONObject jsonobj = new JSONObject(content);
				Map<String, Object> countriesMap = jsonobj.toMap();
				
				
				String contry_q = "Update player_summaries "
						+ "SET country_name = ? , accuracy = 'country', coordinate_x = ? , coordinate_y = ? "
						+ "Where loccountrycode = ? and locstatecode is null and loccityid is null";
				String state_q = "Update player_summaries"
				 		+ " SET country_name = ?, state_name = ? , accuracy = 'state', coordinate_x = ? , coordinate_y = ? "
				 		+ "	where loccountrycode = ? and locstatecode = ? and loccityid is null";
				String city_q = "Update player_summaries "
				 		+ "SET country_name = ? , state_name = ? , city_name = ? , accuracy = 'city' , coordinate_x = ? , coordinate_y = ? "
				 		+ "	where loccountrycode = ? and locstatecode = ? and loccityid = ?";
				String[] temp_coordinates ;
				PreparedStatement ps_country = conn.prepareStatement(contry_q);
				PreparedStatement ps_state = conn.prepareStatement(state_q);
				PreparedStatement ps_city = conn.prepareStatement(city_q);
				int country_num = 1;
				
				/*We want to iterate for each country */
				for (Entry<String, Object> country_entry : countriesMap.entrySet())
				{
					String country_key = country_entry.getKey();
					Map<String, Object> country_map = (Map<String, Object>) country_entry.getValue();
					String country_name = (String) country_map.get("name");
					System.out.println(country_num+ ". "+country_name);
					country_num++;
					if(country_num < 22){
						continue;
					}
					String country_coordinate_xy = (String) country_map.get("coordinates"); // split(,)
					
					String country_coordinate_x = null;
					String country_coordinate_y = null;
					if(country_coordinate_xy == null){
						ps_country.setNull(2, java.sql.Types.VARCHAR);
						ps_country.setNull(3, java.sql.Types.VARCHAR);
					}
					else{
						temp_coordinates = country_coordinate_xy.split(",");
						country_coordinate_x = temp_coordinates[0];
						country_coordinate_y = temp_coordinates[1];
						ps_country.setString(2, country_coordinate_x);
						ps_country.setString(3, country_coordinate_y);
					}
					ps_country.setString(1, country_name);
					ps_country.setString(4, country_key);
					ps_country.executeUpdate();
					
					Map <String, Object> states = (Map<String, Object>)country_map.get("states");
					
					int state_num = 1;
					{
						continue;
					}
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
