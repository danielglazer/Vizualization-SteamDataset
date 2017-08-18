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

public class SimpleQueries4 {

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
					"SET  " + 
					"R.game1casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game2casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game3casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game4casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game5casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game6casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game7casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game8casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game9casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game10casual_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 >= G.playtime_2weeks ), " + 
					"R.game1moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game2moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game3moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks),		 " + 
					"R.game4moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game5moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game6moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game7moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game8moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"R.game9moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks),				 " + 
					"R.game10moderate_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"    60*2*14 < G.playtime_2weeks and 60*4*14 > G.playtime_2weeks), " + 
					"                     " + 
					"R.game1excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game2excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game3excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game4excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game5excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game6excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game7excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game8excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game9excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game10excessive_users = (Select Count(distinct P.steamid) " + 
					"	From player_summaries as P , games_2 as G " + 
					"	where g.appid = ? and P.loccountrycode_alpha3 = ? and G.steamid = P.steamid and  " + 
					"     60*4*14 <= G.playtime_2weeks), " + 
					"R.game1avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game2avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game3avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game4avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game5avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game6avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game7avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game8avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game9avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " + 
					"R.game10avg_play_time =  " + 
					"(select avg((select (G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid and G.appid = ? )) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?), " +  
					"R.avg_play_time =  " + 
					"(select avg((select sum(G.playtime_2weeks) " + 
					"			from games_2 as G " + 
					"			where G.steamid = P.steamid)) " + 
					"	from player_summaries as P  " + 
					"	where P.loccountrycode_alpha3 = ?) " + 
					"where R.alpha3 = ?;";
			// 10 app id's in the array	 
			int[] arr = {570,730,440,4000,72850,252490,8930,105600,221100,218620};
			PreparedStatement ps_country = conn.prepareStatement(feature_q);
			int counter = 0;
			/* We want to iterate for each country */
			for (Map<String, Object> feature : features) {
				System.out.println(++counter + " / " +features.size());
				
				@SuppressWarnings("unchecked")
				Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
				String alpha3 = (String) properties.get("iso_a3");
				// controversial countries
				if(!alpha3.equals("-99")){
					// 20 field to fill for each of them we first state the country then the appid
					for(int i=1; i < 81 ; i+=2){
						ps_country.setInt(i, arr[(i/2)%10]);
						ps_country.setString(i+1, alpha3);
					
					}
					ps_country.setString(81, alpha3);
					ps_country.setString(82, alpha3);
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
