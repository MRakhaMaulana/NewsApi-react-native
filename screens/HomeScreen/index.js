import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Linking } from "react-native";
import axios from "axios";
import { Card, Title, Paragraph } from "react-native-paper";
import Header from "../../components/AppBar";
import { SafeAreaProvider } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = () => {
    axios
      .get("https://newsapi.org/v2/everything?q=tesla&from=2023-06-15&sortBy=publishedAt&apiKey=9d98ae5c24544ffd9e29193d1278e1db")
      .then((response) =>
        response.data.articles.map((article) => ({
          date: `${article.publishedAt}`,
          title: `${article.title}`,
          url: `${article.url}`,
          description: `${article.description}`,
          urlToImage: `${article.urlToImage}`,
        }))
      )
      .then((articles) => {
        setArticles(articles);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View>
        <Header />
        <ScrollView>
          {articles.map((article) => {
            const { date, title, url, description, urlToImage } = article;
            return (
              <Card
                key={url}
                style={{ marginTop: 10, borderColor: "black", borderRadius: 5, borderBottomWidth: 1 }}
                onPress={() => {
                  Linking.openURL(url);
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {/* text */}
                  <View style={{ justifyContent: "space-around", flex: 2 / 3, margin: 10 }}>
                    <Title>{title}</Title>
                  </View>
                  {/* image */}
                  <View style={{ flex: 1 / 3, margin: 10 }}>
                    <Image style={{ width: 120, height: 120 }} source={{ uri: urlToImage }} />
                  </View>
                </View>
                <View style={{ margin: 10 }}>
                  <Paragraph>{description}</Paragraph>
                  <Text>Published At: {date}</Text>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
