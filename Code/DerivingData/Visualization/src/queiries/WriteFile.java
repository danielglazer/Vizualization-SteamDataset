package queiries;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

// Writing to File libraries
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;

public class WriteFile {

	public static void main(String[] args) {

		// read json file
		// file -> string
		// string -> map
		// FeatureCollection -> map
		// Features -> ArrayList (List)
		// for each element in the list : get "properties"
		// manipulate properties (delete all the redundant fields; populate with
		// results table 'entities' (excluding those with 'id'=-99))
		// get alpha3
		// clear
		// add alpha3
		// add columns and coresponding values
		// write as a file / write as string

		String fileInputname = "geojson_medium.json";
		String fileOutputname = "geojson_medium_steam.json";

		try {

			// For each country - go through DB and summarize the stats
			// after each iteration - write the result to file "FILENAME"

			// JDBC connection
			Class.forName("com.mysql.jdbc.Driver").newInstance();

			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/steam_dataset", "root", "root");

			// JsonObject jsonobj = new JsonObject();

			// read json file
			// file -> string
			String content = readFile(fileInputname, StandardCharsets.UTF_8);
			// string -> map
			JSONObject jsonobj = new JSONObject(content);
			// FeatureCollection -> map
			Map<String, Object> featureCollection = jsonobj.toMap();
			// Features -> ArrayList (List)
			List<Map<String, Object>> features = (List<Map<String, Object>>) featureCollection.get("features");
			int counter = 0;
			List<Integer> indeces_to_del = new LinkedList<Integer>();

			String feature_q = "select * " + "from results_table as R " + "where alpha3 = ? ;";
			PreparedStatement ps_country = conn.prepareStatement(feature_q);

			/* We want to iterate for each country */
			for (Map<String, Object> feature : features) {
				// for each element in the list : get "properties"
				Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
				String iso_a3 = (String) properties.get("iso_a3");
				// controversial countries
				if (!iso_a3.equals("-99")) {
					// taking only relevent properties
					String name = (String) properties.get("name");
					String name_long = (String) properties.get("name_long");
					Integer pop_est = (Integer) properties.get("pop_est");
					Object gdp_md_est = properties.get("gdp_md_est");
					String economy = (String) properties.get("economy");
					String income_grp = (String) properties.get("income_grp");
					String iso_a2 = (String) properties.get("iso_a2");
					String continent = (String) properties.get("continent");
					String subregion = (String) properties.get("subregion");
					// clear the properties map
					properties.clear();
					// add only relevent properties
					properties.put("iso_a3", iso_a3);
					properties.put("name", name);
					properties.put("name_long", name_long);
					properties.put("pop_est", pop_est);
					properties.put("gdp_md_est", gdp_md_est);
					properties.put("economy", economy);
					properties.put("income_grp", income_grp);
					properties.put("iso_a2", iso_a2);
					properties.put("continent", continent);
					properties.put("subregion", subregion);

					ps_country.setString(1, iso_a3);
					ResultSet rs = ps_country.executeQuery();

					ResultSetMetaData md = rs.getMetaData();
					int columns = md.getColumnCount();

					rs.next();
					// iso_3 is the first column and already stored
					for (int i = 2; i <= columns; ++i) {
						properties.put(md.getColumnName(i), rs.getObject(i));
					}
				} else {
					indeces_to_del.add(0, counter);
				}
				System.out.println(++counter + " / " + features.size());
			}

			// delete the controversial countries
			for (int i = 0; i < indeces_to_del.size(); i++) {
				features.remove((int)(indeces_to_del.get(i)));
			}

			jsonobj = new JSONObject(featureCollection);
			content = jsonobj.toString();

			try (Writer writer = new BufferedWriter(
					new OutputStreamWriter(new FileOutputStream(fileOutputname), "utf-8"))) {
				writer.write(content);
			}

			// write as a file (as string)
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
