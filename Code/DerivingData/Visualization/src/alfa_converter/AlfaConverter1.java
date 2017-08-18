package alfa_converter;

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

public class AlfaConverter1 {
	
	public static void main(String[] args) {
		/*
		 * for(x){ // countries for(y){ // states for(z){ // cities
		 * 
		 * query select * where x==country && y=state && z= city update } } }
		 */

		String filename = "alpha2to3.json.txt";
		/*
		 * Country [] countries = gson.fromJson(reader, Country.class); State []
		 * states = gson.fromJson(reader, State.class); City [] cities =
		 * gson.fromJson(reader, City.class); System.out.println(countries);
		 */

		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();

			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/newschema", "root", "root");

//			JsonObject jsonobj = new JsonObject();
			
			String content = readFile(filename, StandardCharsets.UTF_8);
			JSONObject jsonobj = new JSONObject(content);
			Map<String, Object> countriesMap = jsonobj.toMap();
			
			//String counteyAlfa3 ="ALTER TABLE player_summaries ADD loccountrycode_alpha3 varchar(3);";
			String counteyAlfa3Addition ="Update player_summaries SET loccountrycode_alpha3 = ? "
					+ "where loccountrycode = ? ;";
//			PreparedStatement ps_countryAlfa3 = conn.prepareStatement(counteyAlfa3);
			PreparedStatement ps_countryAlfa3Add = conn.prepareStatement(counteyAlfa3Addition);
		
		//	ps_countryAlfa3.executeUpdate();
			int i = 0;
			/*We want to iterate for each country */
			for (Entry<String, Object> country_entry : countriesMap.entrySet())
			{
				String loccountrycode = country_entry.getKey();
				String loccountrycode_alpha3 = (String) country_entry.getValue();
				ps_countryAlfa3Add.setString(2, loccountrycode);
				ps_countryAlfa3Add.setString(1, loccountrycode_alpha3);
				ps_countryAlfa3Add.executeUpdate();
				System.out.println(i++);
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
