package queiries;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

public class SimpleQueries2 {

	public static void main(String[] args) {
		
		String filename = "geojson_medium.json";

		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();

			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/steam_dataset", "root", "root");

			String content = readFile(filename, StandardCharsets.UTF_8);
			JSONObject jsonobj = new JSONObject(content);
			Map<String, Object> featureCollection = jsonobj.toMap();

			@SuppressWarnings("unchecked")
			List<Map<String, Object>> features = (List<Map<String, Object>>) featureCollection.get("features");
		
	
			String feature_q = "UPDATE results_table as R " +
					"SET R.num_casual_users = ("
					+ "Select Count(distinct P.steamid) "
					+ "From player_summaries as P  "
					+ "where P.loccountrycode_alpha3 = ? and 60*2*14 >= (Select sum(G.playtime_2weeks) "
					+ "From games_2 as G "
					+ "Where G.steamid = P.steamid)"
					+ "), R.num_moderate_users = ("
					+ "Select Count(distinct P.steamid)"
					+ "From player_summaries as P "
					+ "where P.loccountrycode_alpha3 = ? and 60*2*14 < (Select sum(G.playtime_2weeks) "
					+ "From games_2 as G "
					+ " Where G.steamid = P.steamid) "
					+ "and 60*4*14 > (Select sum(G.playtime_2weeks) "
					+ "From games_2 as G "
					+ "Where G.steamid = P.steamid)"
					+ "), R.num_excessive_users = ("
					+ "Select Count(distinct P.steamid) "
					+ "From player_summaries as P "
					+ "where P.loccountrycode_alpha3 = ? and 60*4*14 <= (Select sum(G.playtime_2weeks) "
					+ " From games_2 as G"
					+ " Where G.steamid = P.steamid) "
					+ ") "
					+ "WHERE R.alpha3 = ?;";
				 
			//PreparedStatement ps_country1 = conn.prepareStatement(feature_q1);
			PreparedStatement ps_country2 = conn.prepareStatement(feature_q);
			int counter = 0;
			/* We want to iterate for each country */
			for (Map<String, Object> feature : features) {
				System.out.println(++counter + "/" +features.size());
				
				@SuppressWarnings("unchecked")
				Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
				String alpha3 = (String) properties.get("iso_a3");
				// controversial countries
				if(!alpha3.equals("-99")){
					ps_country2.setString(1, alpha3);
					ps_country2.setString(2, alpha3);
					ps_country2.setString(3, alpha3);
					ps_country2.setString(4, alpha3);
					ps_country2.executeUpdate();
				}			
			}

			System.out.println("done");

		} catch (Exception ex) {
			ex.printStackTrace();
			/* handle the error */}

	}

	static String readFile(String path, Charset encoding) throws IOException {
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return new String(encoded, encoding);
	}

}
