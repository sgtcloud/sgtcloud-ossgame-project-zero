<GameFile>
  <PropertyGroup Name="ShopIconLayer" Type="Layer" ID="6c256dff-8be2-4b73-b8ce-2846997c213d" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="112" ctype="GameLayerObjectData">
        <Size X="180.0000" Y="280.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="194896547" CallBackType="Touch" Tag="381" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="180.0000" Y="280.0000" />
            <Children>
              <AbstractNodeData Name="item_bg" ActionTag="-1845410923" Tag="382" IconVisible="False" Scale9Enable="True" LeftEage="25" RightEage="25" TopEage="25" BottomEage="25" Scale9OriginX="25" Scale9OriginY="25" Scale9Width="28" Scale9Height="28" ctype="ImageViewObjectData">
                <Size X="180.0000" Y="280.0000" />
                <AnchorPoint />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="mainUI/bg_01.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="item_name" ActionTag="1668559718" Tag="383" IconVisible="False" LeftMargin="29.9999" RightMargin="30.0001" TopMargin="23.9914" BottomMargin="236.0086" FontSize="20" LabelText="道具名称六字" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="120.0000" Y="20.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="89.9999" Y="246.0086" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8786" />
                <PreSize X="0.6667" Y="0.0714" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="itemLayer" ActionTag="542124892" Tag="384" IconVisible="True" LeftMargin="40.0001" RightMargin="39.9999" TopMargin="59.2461" BottomMargin="120.7539" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="100.0000" Y="100.0000" />
                <AnchorPoint />
                <Position X="40.0001" Y="120.7539" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2222" Y="0.4313" />
                <PreSize X="0.5556" Y="0.3571" />
                <FileData Type="Normal" Path="ItemLayer.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="btn" ActionTag="-440389074" Tag="390" IconVisible="False" LeftMargin="45.4916" RightMargin="44.5084" TopMargin="219.3299" BottomMargin="20.6701" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="90.0000" Y="40.0000" />
                <Children>
                  <AbstractNodeData Name="buy_btn" ActionTag="1413242335" Tag="391" IconVisible="False" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="13" RightEage="13" TopEage="13" BottomEage="13" Scale9OriginX="13" Scale9OriginY="13" Scale9Width="6" Scale9Height="21" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="90.0000" Y="40.0000" />
                    <AnchorPoint />
                    <Position />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="1.0000" Y="1.0000" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <PressedFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <NormalFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="buy_text" ActionTag="-1993534234" CallBackType="Click" Tag="392" IconVisible="False" LeftMargin="22.5000" RightMargin="22.5000" TopMargin="9.5000" BottomMargin="9.5000" Scale9Width="45" Scale9Height="21" ctype="ImageViewObjectData">
                    <Size X="45.0000" Y="21.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="45.0000" Y="20.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.5000" Y="0.5250" />
                    <FileData Type="MarkedSubImage" Path="buttonUI/buy2.png" Plist="ButtonUI.plist" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="45.4916" Y="20.6701" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2527" Y="0.0738" />
                <PreSize X="0.5000" Y="0.1429" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="res" ActionTag="1098940521" Tag="393" IconVisible="False" LeftMargin="35.0717" RightMargin="4.9283" TopMargin="173.4077" BottomMargin="81.5923" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="140.0000" Y="25.0000" />
                <Children>
                  <AbstractNodeData Name="icon" ActionTag="2087965809" Tag="394" IconVisible="False" LeftMargin="9.0001" RightMargin="105.9999" TopMargin="-0.0002" BottomMargin="0.0002" Scale9Width="45" Scale9Height="45" ctype="ImageViewObjectData">
                    <Size X="25.0000" Y="25.0000" />
                    <AnchorPoint />
                    <Position X="9.0001" Y="0.0002" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.0643" Y="0.0000" />
                    <PreSize X="0.1786" Y="1.0000" />
                    <FileData Type="Normal" Path="mainUI/key.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="sale_text" ActionTag="420840328" Tag="627" IconVisible="False" LeftMargin="41.9075" RightMargin="43.0925" TopMargin="1.8961" BottomMargin="3.1039" LabelText="999" ctype="TextBMFontObjectData">
                    <Size X="55.0000" Y="20.0000" />
                    <AnchorPoint ScaleY="0.5000" />
                    <Position X="41.9075" Y="13.1039" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2993" Y="0.5242" />
                    <PreSize X="0.3929" Y="0.8000" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white16-export.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="35.0717" Y="81.5923" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1948" Y="0.2914" />
                <PreSize X="0.7778" Y="0.0893" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>