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

public class SimpleQueries3 {

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
		
	
			String feature_q = "UPDATE results_table as R "
					+ "SET "
					+ "R.game1owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game2owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game3owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game4owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game5owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game6owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game7owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game8owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game9owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game10owners = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ?), "
					+ "R.game1active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game2active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game3active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game4active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game5active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game6active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game7active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game8active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game9active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null), "
					+ "R.game10active_users = (SELECT COUNT(DISTINCT P.steamid) "
					+ "From player_summaries as P, games_2 as G "
					+ "where P.loccountrycode_alpha3 = ? and P.steamid = G.steamid and G.appid = ? and G.playtime_2weeks is not null) "
					+ "where R.alpha3 = ?;";
			// 10 app id's in the array	 
			int[] arr = {570,730,440,4000,72850,252490,8930,105600,221100,218620};
			PreparedStatement ps_country = conn.prepareStatement(feature_q);
			int counter = 0;
			/* We want to iterate for each country */
			for (Map<String, Object> feature : features) {
				System.out.println(++counter + "/" +features.size());
				
				@SuppressWarnings("unchecked")
				Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
				String alpha3 = (String) properties.get("iso_a3");
				// controversial countries
				if(!alpha3.equals("-99")){
					// 20 field to fill for each of them we first state the country then the appid
					for(int i=1; i < 41 ; i+=2){
						ps_country.setString(i, alpha3);
						ps_country.setInt(i+1, arr[(i/2)%10]);
					}
					ps_country.setString(41, alpha3);
					ps_country.executeUpdate();
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
